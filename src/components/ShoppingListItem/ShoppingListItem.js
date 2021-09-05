import { useState, useEffect, useRef } from 'react';
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

  const detailsRef = useRef();

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

  // since CSS can't animate between height 0 and height auto, we have to help the animation work
  useEffect(() => {
    if (showSingleDetail) {
      // here we are handling slide down, so the height is set to 0 to start
      // get the exact size "auto" height would be with scrollHeight
      const fullHeight = detailsRef.current.scrollHeight;
      // change the height to this number instead of auto, since then we get an animation
      detailsRef.current.style.height = fullHeight + 'px';

      // add an event listener to set the height back to auto once the transition is complete
      detailsRef.current.addEventListener('transitionend', removeDefinedHeight);

      function removeDefinedHeight() {
        detailsRef.current.removeEventListener(
          'transitionend',
          removeDefinedHeight,
        );
        detailsRef.current.style.height = null; // height will go back to auto
      }

      // now add in the class to show our other animations
      detailsRef.current.classList.add('details_visible');
    } else {
      // here we are handling slide up, so the height is set to auto to start
      // get the exact size "auto" height has worked out to
      const fullHeight = detailsRef.current.scrollHeight;
      // remove transition and save for later, so we don't have to wait when changing height
      const cssTransition = detailsRef.current.style.transition;
      detailsRef.current.style.transition = '';

      // here we're running callbacks once the browser next renders
      requestAnimationFrame(() => {
        // change the height from auto to the exact pixel number we calculated
        // (since we removed the transition, we can change the height with no issues)
        detailsRef.current.style.height = fullHeight + 'px';
        // add the transition back because now we *do* want to see it
        detailsRef.current.style.transition = cssTransition;

        requestAnimationFrame(function () {
          // now set the height to 0 and we will see it animate
          detailsRef.current.style.height = 0 + 'px';
          // add in the class to show our other animations
          detailsRef.current.classList.remove('details_visible');
        });
      });
    }
  }, [showSingleDetail]);

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
          aria-haspopup="true"
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

      <div className="item__details details" ref={detailsRef}>
        <ul
          role="region"
          className="details__list list-reset"
          id={`item-details-${item.id}`}
          aria-label={`${item.itemName} details`}
        >
          <li className="details__detail">
            <span className="details__name">Purchases: </span>
            <span className="details__value">{item.numberOfPurchases}</span>
          </li>

          {item.lastPurchaseDate && ( // if the item has been purchased before
            <li className="details__detail">
              <span className="details__name">Last purchase:</span>
              <span className="details__value">
                {formatDate(item.lastPurchaseDate)}
              </span>
            </li>
          )}

          {item.status === 'inactive' ? (
            <li className="details__detail details__detail_inactive">
              You don't seem to be buying this.&nbsp;
              <button
                className="link_delete link"
                onClick={() => handleModalOpen(item)}
                aria-haspopup="true"
              >
                Delete?
              </button>
            </li>
          ) : (
            // only show the next purchase date for active items
            <li className="details__detail">
              <span className="details__name">Next purchase: </span>
              <span className="details__value">
                {`~ ${formatDate(item.nextPurchaseDate)}`}
              </span>
              <span className="details__value details__value-soon">
                {item.status === 'soon' ? 'soon!' : ''}
              </span>
            </li>
          )}
        </ul>
      </div>
    </li>
  );
};

export default ShoppingListItem;
