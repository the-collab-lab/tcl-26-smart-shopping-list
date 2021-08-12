import firebase from 'firebase/app';
import { db } from '../../lib/firebase.js';
import { useCollection } from 'react-firebase-hooks/firestore';
import ShoppingListItem from '../ShoppingListItem/ShoppingListItem.js';
import { NavLink } from 'react-router-dom';
import calculateEstimate from '../../lib/estimates.js';
import { DateTime } from 'luxon';

function ShoppingList({ listId }) {
  const [listItems, loading, error] = useCollection(
    db.collection(`lists/${listId}/items`).orderBy('purchaseInterval', 'asc'),
  );

  // Helper function to get the latest interval between purchases (expects Luxon date objects)
  const getLatestInterval = ({ lastPurchaseDate, newPurchaseDate }) => {
    const duration = newPurchaseDate.diff(lastPurchaseDate, ['days']);
    return Math.round(duration.as('days'));
  };

  const checkAsPurchased = (itemId, item) => {
    // convert lastPurchaseDate from firestore and JS current time to Luxon DateTime objects
    const lastPurchaseDate = item.lastPurchaseDate?.seconds
      ? DateTime.fromSeconds(item.lastPurchaseDate.seconds)
      : null; // for new items, lastPurchaseDate will be null so keep it null
    const newPurchaseDate = DateTime.fromSeconds(Math.floor(Date.now() / 1000));

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

    db.collection(`lists/${listId}/items`)
      .doc(itemId)
      .update({
        lastPurchaseDate: new firebase.firestore.Timestamp(
          newPurchaseDate.toSeconds(),
          0,
        ),
        numberOfPurchases: firebase.firestore.FieldValue.increment(1),
        purchaseInterval: newPurchaseInterval,
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createListElement = () => {
    if (listItems.empty) {
      return (
        <>
          <p>Your shopping list is currently empty.</p>
          <NavLink to="/add" className="button">
            Add Item
          </NavLink>
        </>
      );
    } else {
      return (
        <ul className="shopping-list__list list-reset">
          {listItems.docs.map((doc) => (
            <ShoppingListItem
              key={doc.id}
              listId={listId}
              itemId={doc.id}
              item={doc.data()}
              checkAsPurchased={checkAsPurchased}
            />
          ))}
        </ul>
      );
    }
  };

  return (
    <div className="shopping-list">
      {loading && (
        <div className="shopping-list__notice notice notice_type_loading">
          Loading...
        </div>
      )}

      {error && (
        <div className="shopping-list__notice notice notice_type_error">
          Error
        </div>
      )}

      {/* !loading is required or else listItems is undefined */}
      {!loading && createListElement()}
    </div>
  );
}

export default ShoppingList;
