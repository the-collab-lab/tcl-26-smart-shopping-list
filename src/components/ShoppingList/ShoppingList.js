import { db } from '../../lib/firebase.js';
import { useCollection } from 'react-firebase-hooks/firestore';
import ShoppingListItem from '../ShoppingListItem/ShoppingListItem.js';
import { useHistory } from 'react-router-dom';

function ShoppingList({ listId }) {
  let history = useHistory();

  const [listItems, loading, error] = useCollection(
    db.collection(`lists/${listId}/items`).orderBy('purchaseInterval', 'asc'),
  );

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
    }

    return (
      <ul className="shopping-list__list">
        {listItems.docs.map((doc) => (
          <ShoppingListItem key={doc.id} item={doc.data()} />
        ))}
      </ul>
    );
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
