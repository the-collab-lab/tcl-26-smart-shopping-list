import { useState, useEffect } from 'react';

import {
  isRecentlyPurchased,
  isPurchaseWithinUndoWindow,
} from '../../utils/dateTimeUtils.js';

import './ShoppingListItem.css';

const ShoppingListItem = ({
  item,
  checkAsPurchased,
  uncheckAsPurchased,
  handleModalOpen,
}) => {
  const [recentlyPurchased, setRecentlyPurchased] = useState(false);
  const [itemNotice, setItemNotice] = useState({});

  const itemUncheckWarningMessage = `You already purchased this in the last 24 hours`;

  // allows for undoing an accidental purchase within a certain time window
  const handleUncheck = (item) => {
    // check if the purchase happened within the last 5 minutes
    isPurchaseWithinUndoWindow(item.lastPurchaseDate.seconds)
      ? uncheckAsPurchased(item)
      : setItemNotice({
          message: itemUncheckWarningMessage,
          type: 'assertive',
          error: false,
          screenReadOnly: false,
        });
  };

  // allows for undoing an accidental purchase within a certain time window
  const handleCheck = (item) => {
    checkAsPurchased(item)
      .then(() => {
        setItemNotice({
          message: `Purchased ${item.itemName}`,
          type: 'polite',
          error: false,
          screenReadOnly: true,
        });
      })
      .catch((err) => {
        setItemNotice({
          message: 'Sorry, there was a problem',
          type: 'assertive',
          error: true,
          screenReadOnly: false,
        });
      });
  };

  // update whether item is recently purchased
  useEffect(() => {
    // make sure properties exist and are not null
    if (item?.lastPurchaseDate?.seconds)
      setRecentlyPurchased(isRecentlyPurchased(item.lastPurchaseDate.seconds));
  }, [item]);

  return (
    <li className="shopping-list__item item" id={`item-${item.id}`}>
      <input
        id={`item-input-${item.id}`}
        value={item.id}
        type="checkbox"
        checked={recentlyPurchased}
        onBlur={
          () =>
            setItemNotice(
              '',
            ) /*remove message when no longer focused on checkbox */
        }
        className={`checkbox item__checkbox ${
          recentlyPurchased ? 'checkbox_recently-purchased' : ''
        } item__checkbox_${item.status}`}
        onChange={(e) =>
          e.target.checked ? handleCheck(item) : handleUncheck(item)
        }
      />
      <label
        className={`label label_check-radio item__label item__label_${item.status}`}
        htmlFor={`item-input-${item.id}`}
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
      <div
        aria-live={itemNotice?.type ? itemNotice.type : 'polite'}
        className={`item__message ${
          itemNotice?.screenReadOnly ? 'visually-hidden' : ''
        } ${itemNotice?.error ? 'error' : ''}`}
      >
        {itemNotice.message}
      </div>
    </li>
  );
};

export default ShoppingListItem;
