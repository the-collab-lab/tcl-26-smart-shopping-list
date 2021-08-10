import firebase from 'firebase/app';
import { db } from '../../lib/firebase.js';
import { useCollection } from 'react-firebase-hooks/firestore';
import ShoppingListItem from '../ShoppingListItem/ShoppingListItem.js';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';

function ShoppingList({ listId }) {
  let history = useHistory();

  const [listItems, loading, error] = useCollection(
    db.collection(`lists/${listId}/items`).orderBy('purchaseInterval', 'asc'),
  );

  const [filter, setFilter] = useState('');

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

  const handleInput = (e) => {
    setFilter(e.target.value);
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
          {listItems.docs
            .filter((doc) => {
              return doc.data().itemName.includes(filter.toLowerCase());
            })
            .map((doc) => (
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
      <div className="filter">
        <label htmlFor="filterInput" className="filter__label">
          Filter items
        </label>
        <input
          type="text"
          id="filterInput"
          name="filterInput"
          value={filter}
          onChange={handleInput}
          className="filter__text-field text-field"
        />
        <button
          type="button"
          aria-label="clear"
          className="filter__button"
          onClick={() => setFilter('')}
        >
          Clear Filter
        </button>
      </div>

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
