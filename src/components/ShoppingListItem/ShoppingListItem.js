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
  showAllDetails,
  handleModalOpen,
}) => {
  const [recentlyPurchased, setIsRecentlyPurchased] = useState(false);
  const [itemNotice, setItemNotice] = useState({});

  const [showSingleDetail, setShowSingleDetail] = useState(false);

  const currentYear = DateTime.now().toFormat('yyyy');

  const formatDate = (unformattedDate) => {
    let purchaseDate;
    if (unformattedDate instanceof DateTime)
      // if it's a Luxon date already, we're good to go
      purchaseDate = unformattedDate;
    else if (unformattedDate?.seconds) {
      // if it's from Firestore, make it a Luxon date
      purchaseDate = DateTime.fromSeconds(unformattedDate?.seconds);
    } else return ''; // otherwise, just return an empty string

    if (currentYear !== purchaseDate.toFormat('yyyy')) {
      return (
        <>
          {purchaseDate.toFormat('MMM d')}
          <span className="details__year"> '{purchaseDate.toFormat('yy')}</span>
        </>
      );
    } else return purchaseDate.toFormat('MMM d');
  };

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

  // change whether the item details are shown if showAllDetails is changed
  useEffect(() => {
    setShowSingleDetail(showAllDetails);
  }, [showAllDetails]);

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
          className={`item__details-button ${
            showSingleDetail ? 'item__details-button_expanded' : ''
          } icon-only-button`}
          aria-controls={`item-details-${item.id}`}
          aria-expanded={showSingleDetail}
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
          showSingleDetail ? 'details_visible' : ''
        } list-reset`}
        id={`item-details-${item.id}`}
        aria-label={`${item.itemName} details`}
      >
        <li className="details__detail">
          <span className="details__name">Purchases: </span>
          <span className="details__value">{item.numberOfPurchases}</span>
        </li>
        <li className="details__detail">
          {item.lastPurchaseDate && ( // if the item has been purchased before
            <>
              <span className="details__name">Last purchase:</span>
              <span className="details__value">
                {formatDate(item.lastPurchaseDate)}
              </span>
            </>
          )}
        </li>
        {item.status === 'inactive' ? (
          <li className="details__detail details__detail_inactive">
            You don't seem to be buying this.&nbsp;
            <button
              className="link_delete link"
              onClick={() => handleModalOpen(item)}
            >
              Delete?
            </button>
          </li>
        ) : (
          // only show the next purchase date for active items
          <li className="details__detail">
            <span className="details__name">Next purchase: </span>
            <span className="details__value">
              {formatDate(item.nextPurchaseDate)}
            </span>
            <span className="details__value details__value-soon">
              {item.status === 'kind-of-soon' ? 'soon!' : ''}
            </span>
          </li>
        )}
      </ul>
    </li>
  );
};

export default ShoppingListItem;
