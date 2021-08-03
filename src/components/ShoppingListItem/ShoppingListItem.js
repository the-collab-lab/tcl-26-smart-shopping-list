import { useState, useEffect } from 'react';

import isUnder24hSincePurchased from '../../utils/isUnder24hSincePurchased.js';

const ShoppingListItem = ({ listId, itemId, item, handleCheck }) => {
  const [recentlyPurchased, setRecentlyPurchased] = useState(false);

  // update whether item is recently purchased
  useEffect(() => {
    // make sure properties exist and are not null
    if (
      'lastPurchaseDate' in item &&
      item.lastPurchaseDate &&
      'seconds' in item.lastPurchaseDate
    )
      setRecentlyPurchased(
        isUnder24hSincePurchased(item.lastPurchaseDate.seconds),
      );
  }, [item]);

  return (
    <li className="shopping-list__item item">
      <input
        id={`item-${itemId}`}
        value={itemId}
        type="checkbox"
        disabled={recentlyPurchased}
        checked={recentlyPurchased}
        className={`checkbox shopping-list__checkbox ${recentlyPurchased} ? 'checkbox_recently-purchased' : '' `}
        onChange={handleCheck}
      />
      <label
        className="label label_check-radio shopping-list__label"
        htmlFor={`item-${itemId}`}
      >
        {item.itemName}
      </label>
    </li>
  );
};

export default ShoppingListItem;
