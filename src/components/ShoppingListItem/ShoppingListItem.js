import { db } from '../../lib/firebase.js';
import { useState, useEffect } from 'react';

import isUnder24hSincePurchased from '../../utils/isUnder24hSincePurchased.js';

const ShoppingListItem = ({ listId, itemId, item }) => {
  const [recentlyPurchased, setRecentlyPurchased] = useState(
    isUnder24hSincePurchased(item.lastPurchaseDate),
  );

  // update whether item is recently purchased
  useEffect(() => {
    setRecentlyPurchased(isUnder24hSincePurchased(item.lastPurchaseDate));
  }, [item.lastPurchaseDate]);

  return (
    <li className="shopping-list__item item">
      <input
        id={`item-${itemId}`}
        value={itemId}
        type="checkbox"
        disabled={recentlyPurchased}
        checked={recentlyPurchased}
        className={`checkbox shopping-list__checkbox ${recentlyPurchased} ? 'checkbox_recently-purchased' : '' `}
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
