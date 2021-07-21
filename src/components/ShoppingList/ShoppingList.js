import { db } from '../../lib/firebase.js';
import { useCollection } from 'react-firebase-hooks/firestore';
import ShoppingListItem from '../ShoppingListItem/ShoppingListItem.js';

function ShoppingList({ listId }) {
  const [listItems, loading, error] = useCollection(
    db.collection(`lists/${listId}/items`).orderBy('purchaseInterval', 'asc'),
  );

  return (
    <div>
      {loading && <>Loading...</>}
      {error && <>Error</>}
      {!loading && listItems && (
        <ul className="shopping-list">
          {listItems.docs.map((doc) => (
            <ShoppingListItem key={doc.id} item={doc.data()} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default ShoppingList;
