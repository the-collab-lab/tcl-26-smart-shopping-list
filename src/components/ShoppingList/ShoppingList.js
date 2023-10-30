import firebase from 'firebase/app';
import { db } from '../../lib/firebase.js';

import calculateEstimate from '../../lib/estimates.js';
import { DateTime } from 'luxon';

import ShoppingListItem from '../ShoppingListItem/ShoppingListItem.js';

function ShoppingList({ listItems, listId, showAllDetails, handleModalOpen }) {
  // Helper function to get the latest interval between purchases (expects Luxon date objects)
  const getLatestInterval = ({ lastPurchaseDate, newPurchaseDate }) => {
    const duration = newPurchaseDate.diff(lastPurchaseDate, ['days']);
    return Math.round(duration.as('days'));
  };

  const checkAsPurchased = (item) => {
    // convert lastPurchaseDate from firestore and JS current time to Luxon DateTime objects
    const lastPurchaseDate = item.lastPurchaseDate?.seconds
      ? DateTime.fromSeconds(item.lastPurchaseDate.seconds)
      : null; // for new items, lastPurchaseDate will be null so keep it null
    const newPurchaseDate = DateTime.fromSeconds(Math.floor(Date.now() / 1000)); // current time

    // if lastPurchaseDate is null (item not yet purchased), a latest interval can't be
    // calculated, so in that case set latestInterval to the current purchaseInterval
    const latestInterval =
      lastPurchaseDate === null
        ? item.purchaseInterval
        : getLatestInterval({ lastPurchaseDate, newPurchaseDate });

    const newPurchaseInterval = calculateEstimate(
      item.purchaseInterval,
      latestInterval,
      item.numberOfPurchases,
    );

    return db
      .collection(`lists/${listId}/items`)
      .doc(item.id)
      .update({
        lastPurchaseDate: firebase.firestore.FieldValue.serverTimestamp(),
        numberOfPurchases: firebase.firestore.FieldValue.increment(1),
        purchaseInterval: newPurchaseInterval,
        // back up some info in case user mistakenly checks item and wants to undo
        backupValues: {
          lastPurchaseDate: item.lastPurchaseDate,
          purchaseInterval: item.purchaseInterval,
        },
      });
  };

  // restores item's previous lastPurchaseDate, purchaseInterval and numberOfPurchases
  // for use when a user accidentally checks an item off, and wants to undo
  const uncheckAsPurchased = (item) => {
    return db
      .collection(`lists/${listId}/items`)
      .doc(item.id)
      .update({
        // decrement total purchases by 1
        numberOfPurchases: firebase.firestore.FieldValue.increment(-1),
        // restore to stats saved in backupValues field
        lastPurchaseDate: item.backupValues.lastPurchaseDate,
        purchaseInterval: item.backupValues.purchaseInterval,
        backupValues: {},
      });
  };

  return (
    <div className="shopping-list">
      <ul className="shopping-list__list list-reset">
        {listItems?.map((item) => (
          <ShoppingListItem
            key={item.id}
            item={item}
            checkAsPurchased={checkAsPurchased}
            uncheckAsPurchased={uncheckAsPurchased}
            showAllDetails={showAllDetails}
            handleModalOpen={handleModalOpen}
          />
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;
