import firebase from 'firebase/app';
import { db } from '../../lib/firebase.js';
import { useCollection } from 'react-firebase-hooks/firestore';
import ShoppingListItem from '../ShoppingListItem/ShoppingListItem.js';

function ShoppingList({ listId }) {
  const [listItems, loading, error] = useCollection(
    db.collection(`lists/${listId}/items`).orderBy('purchaseInterval', 'asc'),
  );

  const handleCheck = (e) => {
    if (!e.target.checked) return; // don't do anything if the checkbox isn't checked

    const itemId = e.target.value;
    db.collection(`lists/${listId}/items`)
      .doc(itemId)
      .update({
        lastPurchaseDate: firebase.firestore.FieldValue.serverTimestamp(),
        numberOfPurchases: firebase.firestore.FieldValue.increment(1),
      })
      .catch((err) => {
        console.log(err);
      });
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

      {!loading && listItems && (
        <ul className="shopping-list__list list-reset">
          {listItems.docs.map((doc) => (
            <ShoppingListItem
              key={doc.id}
              listId={listId}
              itemId={doc.id}
              item={doc.data()}
              handleCheck={handleCheck}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default ShoppingList;
