import { useState, useEffect } from 'react';

import isUnder24hSincePurchased from '../../utils/isUnder24hSincePurchased.js';

const ShoppingListItem = ({ item, checkAsPurchased }) => {
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
    <li className="shopping-list__item item">
      <input
        id={`item-${item.id}`}
        value={item.id}
        type="checkbox"
        disabled={recentlyPurchased}
        checked={recentlyPurchased}
        className={`checkbox shopping-list__checkbox 
        ${recentlyPurchased} ? 'checkbox_recently-purchased' : '' 
        checkbox_${item.status}
        `}
        onChange={() => checkAsPurchased(item)}
      />
      <label
        className="label label_check-radio shopping-list__label"
        htmlFor={`item-${item.id}`}
      >
        {item.itemName}
        <span className="visually-hidden">
          {item.status === 'soon' && ' Need to buy soon'}
          {item.status === 'kind-of-soon' && ' Need to buy kind of soon'}
          {item.status === 'not-soon' && " Don't need to buy soon"}
          {item.status === 'inactive' && ' Inactive'}
        </span>
      </label>
    </li>
  );
};

export default ShoppingListItem;
