import { useState, useEffect } from 'react';

import isUnder24hSincePurchased from '../../utils/isUnder24hSincePurchased.js';

const ShoppingListItem = ({
  itemId,
  item,
  checkAsPurchased,
  handleModalOpen,
}) => {
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
    <li className="shopping-list__item item" id={`item-${itemId}`}>
      <input
        id={`item-input-${itemId}`}
        value={itemId}
        type="checkbox"
        disabled={recentlyPurchased}
        checked={recentlyPurchased}
        className={`checkbox item__checkbox ${recentlyPurchased} ? 'checkbox_recently-purchased' : '' `}
        onChange={() => checkAsPurchased(itemId, item)}
      />
      <label
        className="label label_check-radio item__label"
        htmlFor={`item-input-${itemId}`}
      >
        {item.itemName}
      </label>

      <button
        type="button"
        onClick={() => handleModalOpen(item, itemId)}
        aria-controls={`item-${itemId}`} // destructive delete controls shopping list item id
        className="item__delete"
      >
        Delete
      </button>
    </li>
  );
};

export default ShoppingListItem;
