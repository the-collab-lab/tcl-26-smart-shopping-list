import firebase from 'firebase/app';
import { db } from '../../lib/firebase.js';
import { useCollection } from 'react-firebase-hooks/firestore';
import ShoppingListItem from '../ShoppingListItem/ShoppingListItem.js';
import { useHistory } from 'react-router-dom';

function ShoppingList({ listId }) {
  let history = useHistory();

  const [listItems, loading, error] = useCollection(
    db.collection(`lists/${listId}/items`).orderBy('purchaseInterval', 'asc'),
  );

  const handleCheck = (e) => {
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
              handleCheck={handleCheck}
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
