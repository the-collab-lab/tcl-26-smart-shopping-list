import firebase from 'firebase/app';
import { db } from '../../lib/firebase.js';
import { useCollection } from 'react-firebase-hooks/firestore';
import ShoppingListItem from '../ShoppingListItem/ShoppingListItem.js';
import { useHistory } from 'react-router-dom';
import calculateEstimate from '../../lib/estimates.js';
import { DateTime } from 'luxon';

function ShoppingList({ listId }) {
  let history = useHistory();

  const [listItems, loading, error] = useCollection(
    db.collection(`lists/${listId}/items`).orderBy('purchaseInterval', 'asc'),
  );

  /*
   * Helper function to get the latest interval between purchases (takes Luxon date objects)
   * Note: must account for the possibility an item hasn't been purchased, so lastPurchaseDate is null
   **/
  const getLatestInterval = (args) => {
    const { lastPurchaseDate, newPurchaseDate, defaultInterval } = args;

    if (
      lastPurchaseDate instanceof DateTime &&
      newPurchaseDate instanceof DateTime
    ) {
      // if lastPurchaseDate is a valid date, calculate the interval
      const duration = newPurchaseDate.diff(lastPurchaseDate, ['days']);
      return Math.round(duration.as('days'));
    } else {
      // otherwise, return the default value provided
      return defaultInterval;
    }
  };

  const checkAsPurchased = (itemId, item) => {
    // convert lastPurchaseDate from firestore and JS current time to Luxon DateTime objects
    const lastPurchaseDate = item.lastPurchaseDate?.seconds
      ? DateTime.fromSeconds(item.lastPurchaseDate.seconds)
      : null; // for new items, lastPurchaseDate will be null so keep it null
    const newPurchaseDate = DateTime.fromMillis(Date.now());

    /* since an interval can't be calculated when the lastPurchaseDate is null,
     * we provide the saved purchaseInterval as a default (the user's initial estimate) */
    const latestInterval = getLatestInterval({
      lastPurchaseDate: lastPurchaseDate,
      newPurchaseDate: newPurchaseDate,
      defaultInterval: item.purchaseInterval,
    });

    const newPurchaseInterval = calculateEstimate(
      item.purchaseInterval,
      latestInterval,
      item.numberOfPurchases,
    );

    db.collection(`lists/${listId}/items`)
      .doc(itemId)
      .update({
        lastPurchaseDate: firebase.firestore.Timestamp.fromMillis(
          newPurchaseDate.toMillis(),
        ),
        numberOfPurchases: firebase.firestore.FieldValue.increment(1),
        purchaseInterval: newPurchaseInterval,
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClick = () => {
    history.push('/add');
  };

  const createListElement = () => {
    if (listItems.empty) {
      return (
        <>
          <p>Your shopping list is currently empty.</p>
          <button className="button" type="button" onClick={handleClick}>
            Add Item
          </button>
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
