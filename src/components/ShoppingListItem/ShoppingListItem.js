import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

import {
  isRecentlyPurchased,
  isPurchaseWithinUndoWindow,
} from '../../utils/dateTimeUtils.js';

import './ShoppingListItem.css';

import { ReactComponent as CheckboxIcon } from '../../images/icon-checkbox.svg';
import { ReactComponent as DetailsIcon } from '../../images/icon-arrow.svg';
import { ReactComponent as DeleteIcon } from '../../images/icon-delete.svg';

const ShoppingListItem = ({
  item,
  checkAsPurchased,
  uncheckAsPurchased,
  showDetails,
  handleModalOpen,
}) => {
  const [recentlyPurchased, setIsRecentlyPurchased] = useState(false);
  const [itemNotice, setItemNotice] = useState({});

  const [showSingleDetail, setShowSingleDetail] = useState(showDetails);

  //Date variables for details view

  //Last Purchase
  let purchasedDate;
  if (item.lastPurchaseDate?.seconds) {
    purchasedDate = DateTime.fromSeconds(item.lastPurchaseDate?.seconds);
  } else {
    purchasedDate = DateTime.fromSeconds(item.createdAt?.seconds);
  }

  const currentYear = DateTime.now().toFormat('yyyy');
  const purchasedYear = purchasedDate.toFormat('yyyy');

  const itemUncheckWarningMessage =
    'You already purchased this in the last 24 hours';

  // allows for undoing an accidental purchase within a certain time window
  const handleUncheck = (item) => {
    if (
      item?.lastPurchaseDate?.seconds &&
      isPurchaseWithinUndoWindow(item.lastPurchaseDate.seconds)
    ) {
      // if the purchase happened within the last 5 minutes, undo it
      uncheckAsPurchased(item)
        .then(() => {
          setItemNotice({
            message: `${item.itemName} purchase undone`,
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
    } else {
      setItemNotice({
        message: itemUncheckWarningMessage,
        type: 'assertive',
        error: false,
        screenReadOnly: false,
      });
    }
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
    // if last purchase date is null, make sure to set isRecentlyPurchased to false
    setIsRecentlyPurchased(
      item?.lastPurchaseDate?.seconds
        ? isRecentlyPurchased(item.lastPurchaseDate.seconds)
        : false,
    );
  }, [item]);

  return (
    <li className="shopping-list__item item" id={`item-${item.id}`}>
      <div className="item__primary">
        <input
          id={`item-input-${item.id}`}
          value={item.id}
          type="checkbox"
          checked={recentlyPurchased}
          /* remove message when no longer focused on checkbox */
          onBlur={() => setItemNotice('')}
          className={`checkbox item__checkbox visually-hidden ${
            recentlyPurchased ? 'checkbox_recently-purchased' : ''
          } item__checkbox_${item.status}`}
          onChange={(e) =>
            e.target.checked ? handleCheck(item) : handleUncheck(item)
          }
        />
        <label
          htmlFor={`item-input-${item.id}`}
          className={`item__checkbox-target checkbox-target ${
            recentlyPurchased ? 'checkbox-target_recently-purchased' : ''
          } checkbox-target_status_${item.status}`}
        >
          <CheckboxIcon aria-hidden="true" focusable="false" />
        </label>
        <label
          className={`item__label item__label_${item.status}`}
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
          onClick={() => setShowSingleDetail(!showSingleDetail)}
          aria-label={`${item.itemName} details`}
          className="item__details-button icon-only-button"
          aria-controls={`item-details-${item.id}`}
          aria-expanded={showDetails}
        >
          <DetailsIcon aria-hidden="true" focusable="false" />
        </button>
        <button
          type="button"
          onClick={() => handleModalOpen(item)}
          aria-controls={`item-${item.id}`} // destructive delete controls shopping list item id
          aria-label={`Delete ${item.itemName}`}
          className="item__delete-button icon-only-button"
        >
          <DeleteIcon aria-hidden="true" focusable="false" />
        </button>
      </div>

      {/**
       * A space for item-related user feedback, which may be visual or for screen readers only.
       * Note: seems that showing the aria-live region conditionally doesn't work with screen readers tested,
       * so that's why the div is always present even when it's empty. */}
      <div
        aria-live={itemNotice?.type ? itemNotice.type : 'polite'}
        className={`notice item__message ${
          itemNotice?.type ? 'item__message_visible' : ''
        } ${itemNotice?.screenReadOnly ? 'visually-hidden' : ''} ${
          itemNotice?.error ? 'error' : ''
        }`}
      >
        {itemNotice?.message && itemNotice.message}
      </div>

      <ul
        role="region"
        className={`item__details details ${
          showDetails ? 'details_visible' : ''
        } list-reset`}
        id={`item-details-${item.id}`}
        aria-label={`${item.itemName} details`}
      >
        <li className="details__detail">
          <span className="details__name">Purchases: </span>
          <span className="details__value">{item.numberOfPurchases}</span>
        </li>
        <li className="details__detail">
          <span className="details__name">Last purchase:</span>
          <span className="details__value">
            {currentYear !== purchasedYear
              ? purchasedDate.toFormat('MMMM dd, yyyy')
              : purchasedDate.toFormat('MMMM dd')}
          </span>
        </li>
        <li className="details__detail">
          <span className="details__name">Next purchase: </span>
          <span className="details__value">
            {currentYear !== purchasedYear
              ? item.nextPurchaseDate.toFormat('MMMM dd, yyyy')
              : item.nextPurchaseDate.toFormat('MMMM dd')}
          </span>
        </li>
      </ul>
    </li>
  );
};

export default ShoppingListItem;
