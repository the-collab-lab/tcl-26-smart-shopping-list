import { useState, useEffect } from 'react';

import isUnder24hSincePurchased from '../../utils/isUnder24hSincePurchased.js';

import './ShoppingListItem.css';

const ShoppingListItem = ({ item, checkAsPurchased, handleModalOpen }) => {
  const [recentlyPurchased, setRecentlyPurchased] = useState(false);

  // update whether item is recently purchased
  useEffect(() => {
    // make sure properties exist and are not null
    if (item?.lastPurchaseDate?.seconds)
      setRecentlyPurchased(
        isUnder24hSincePurchased(item.lastPurchaseDate.seconds),
      );
  }, [item]);

  return (
    <li className="shopping-list__item item" id={`item-${item.id}`}>
      <input
        id={`item-input-${item.id}`}
        value={item.id}
        type="checkbox"
        disabled={recentlyPurchased}
        checked={recentlyPurchased}
        className={`checkbox item__checkbox ${
          recentlyPurchased ? 'checkbox_recently-purchased' : ''
        } item__checkbox_${item.status}`}
        onChange={() => checkAsPurchased(item)}
      />
      <label
        className={`label label_check-radio item__label item__label_${item.status}`}
        htmlFor={`item-${item.id}`}
      >
        {item.itemName}
        <span className="visually-hidden">
          {/* text for screen readers only, based on item.status set in ShoppingList with getItemStatus function */}
          {item.status === 'soon' && ' Need to buy soon'}
          {item.status === 'kind-of-soon' && ' Need to buy kind of soon'}
          {item.status === 'not-soon' && " Don't need to buy soon"}
          {item.status === 'inactive' && ' Inactive'}
        </span>
      </label>

      <button
        type="button"
        onClick={() => handleModalOpen(item)}
        aria-controls={`item-${item.id}`} // destructive delete controls shopping list item id
        aria-label={`Delete ${item.itemName}`}
        className="item__delete"
      >
        Delete
      </button>
    </li>
  );
};

export default ShoppingListItem;
