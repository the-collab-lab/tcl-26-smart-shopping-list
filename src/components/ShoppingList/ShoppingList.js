import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import firebase from 'firebase/app';
import { db } from '../../lib/firebase.js';

import calculateEstimate from '../../lib/estimates.js';
import { DateTime } from 'luxon';

import ItemFilter from '../ItemFilter/ItemFilter.js';
import ShoppingListItem from '../ShoppingListItem/ShoppingListItem.js';

function ShoppingList({ listItems, listId, handleModalOpen }) {
  const [filter, setFilter] = useState('');

  const currentDate = DateTime.fromSeconds(Math.floor(Date.now() / 1000));

  // format the data from firestore into a sorted, filtered array of items
  // add new properties: item.status and item.daysToPurchase
  const itemsToDisplay = listItems?.docs
    // filter first to minimize mapping and sorting work
    .filter((doc) => new RegExp(filter, 'i').test(doc.data().itemName))
    .map((doc) => {
      const item = doc.data();
      item.id = doc.id;
      item.daysToPurchase = getDaysToPurchase(item);
      item.status = getItemStatus(item);
      return item;
    })
    .sort(sortListItems);

  /**
   * Calculate the number of days until the estimated next purchase date, based on the
   * purchaseInterval and lastPurchaseDate (or createdAt date for new items not yet purchased)
   *
   * @param {Object} item A list item with properties lastPurchaseDate, purchaseInterval, and createdAt
   * (retrieved from Firestore item field data)
   *
   * @return {Number} Number of days remaining until the estimated next purchase date
   */
  function getDaysToPurchase(item) {
    let nextPurchaseDate;
    if (item.lastPurchaseDate?.seconds) {
      // if the item has been purchased before, next purchase date is `purchaseInterval` days from the lastPurchaseDate
      nextPurchaseDate = DateTime.fromSeconds(
        item.lastPurchaseDate.seconds,
      ).plus({ days: item.purchaseInterval });
    } else if (item.createdAt?.seconds) {
      // if there's no purchase history, estimate it will be bought `purchaseInterval` days from when item was created
      // (user provides this info at item creation)
      nextPurchaseDate = DateTime.fromSeconds(item.createdAt.seconds).plus({
        days: item.purchaseInterval,
      });
    } else return null;

    const daysRemaining = nextPurchaseDate.diff(currentDate, ['days']);
    return Math.round(daysRemaining.as('days'));
  }

  /**
   * Returns a string label indicating the status of an item, based on how soon the next purchase date is estimated to be
   * (strings chosen to be useful as CSS class modifiers)
   * - 'soon' indicates less than 7 days are left until the next estimated purchase date
   * - 'kind-of-soon' indicates there are 7-30 days left until the next estimated purchase date
   * - 'not-soon' indicates there are more than 30 days left until the next estimated purchase date
   * - 'inactive' indicates more than 2x the estimated purchaseInterval has elapsed since the last purchase or date created
   * @see isItemInactive
   *
   * @param {Object} item A list item with properties lastPurchaseDate, purchaseInterval, createdAt and daysToPurchase
   * (retrieved from Firestore item field data, with 'daysToPurchase' property added)
   *
   * @return {String} Either 'soon', 'kind-of-soon', 'not-soon' or 'inactive'
   */
  function getItemStatus(item) {
    if (isItemInactive(item)) return 'inactive';
    if (item.daysToPurchase < 7) return 'soon';
    if (item.daysToPurchase >= 7 && item.daysToPurchase <= 30)
      return 'kind-of-soon';
    if (item.daysToPurchase > 30) return 'not-soon';
  }

  /**
   * Checks whether an item is inactive. An item is considered inactive once more than 2x the purchaseInterval
   * has elapsed since the last date the item was purchased (or the date the item was created if never purchased)
   *
   * @param {Object} item A list item with properties lastPurchaseDate, purchaseInterval, and createdAt
   * (retrieved from Firestore item field data)
   *
   * @return {Boolean} Whether item is inactive (true) or not (false)
   */
  function isItemInactive(item) {
    const estimateDate =
      item.lastPurchaseDate?.seconds || item.createdAt?.seconds;

    if (estimateDate) {
      return (
        currentDate
          .diff(DateTime.fromSeconds(estimateDate), ['days'])
          .as('days') >=
        2 * item.purchaseInterval
      );
    }
  }

  /**
   * To be used with Array.prototype.sort(), this function compares items according to the following rules:
   * - items that are inactive always come later than items that are active
   * - all items are sorted by estimated number of days until next purchase date, with those expected to be
   *   bought sooner appearing higher up on the list
   * - items with the same estimated number of days until next purchase date are sorted alphabetically
   *
   * @param {Object} itemA A list item with properties status, daysToPurchase, and itemName
   * (retrieved from Firestore item field data, with 'status' and 'daysToPurchase' properties added)
   * @param {Object} itemB A second list item to compare against
   *
   * @return {Number} a positive number indicating the itemA should appear later than itemB OR
   * negative number indicating itemA should appear after itemB OR 0 indicating both are considered equal
   */
  function sortListItems(itemA, itemB) {
    // if both items are inactive, or neither is inactive, sort by days until next purchase
    if (
      (itemA.status === 'inactive' && itemB.status === 'inactive') ||
      (itemA.status !== 'inactive' && itemB.status !== 'inactive')
    ) {
      if (itemA.daysToPurchase < itemB.daysToPurchase) return -1;
      if (itemA.daysToPurchase > itemB.daysToPurchase) return 1;

      // if we've made it this far, days to purchase is the same for both items so alphabetize
      return itemA.itemName.localeCompare(itemB.itemName, 'en', {
        sensitivity: 'base',
        ignorePunctuation: true,
      });
    } else {
      // if one item is inactive and the other is not, bump down the inactive item
      if (itemA.status === 'inactive') return 1;
      if (itemB.status === 'inactive') return -1;
    }
  }

  // Helper function to get the latest interval between purchases (expects Luxon date objects)
  const getLatestInterval = ({ lastPurchaseDate, newPurchaseDate }) => {
    const duration = newPurchaseDate.diff(lastPurchaseDate, ['days']);
    return Math.round(duration.as('days'));
  };

  const checkAsPurchased = (item) => {
    // convert lastPurchaseDate from firestore and JS current time to Luxon DateTime objects
    const lastPurchaseDate = item.lastPurchaseDate?.seconds
      ? DateTime.fromSeconds(item.lastPurchaseDate.seconds)
      : null; // for new items, lastPurchaseDate will be null so keep it null
    const newPurchaseDate = currentDate;

    // if lastPurchaseDate is null (item not yet purchased), a latest interval can't be
    // calculated, so in that case set latestInterval to the current purchaseInterval
    const latestInterval =
      lastPurchaseDate === null
        ? item.purchaseInterval
        : getLatestInterval({ lastPurchaseDate, newPurchaseDate });

    const newPurchaseInterval = calculateEstimate(
      item.purchaseInterval,
      latestInterval,
      item.numberOfPurchases,
    );

    return db
      .collection(`lists/${listId}/items`)
      .doc(item.id)
      .update({
        lastPurchaseDate: firebase.firestore.FieldValue.serverTimestamp(),
        numberOfPurchases: firebase.firestore.FieldValue.increment(1),
        purchaseInterval: newPurchaseInterval,
        // back up some info in case user mistakenly checks item and wants to undo
        backupValues: {
          lastPurchaseDate: item.lastPurchaseDate,
          purchaseInterval: item.purchaseInterval,
        },
      });
  };

  // restores item's previous lastPurchaseDate, purchaseInterval and numberOfPurchases
  // for use when a user accidentally checks an item off, and wants to undo
  const uncheckAsPurchased = (item) => {
    return db
      .collection(`lists/${listId}/items`)
      .doc(item.id)
      .update({
        // decrement total purchases by 1
        numberOfPurchases: firebase.firestore.FieldValue.increment(-1),
        // restore to stats saved in backupValues field
        lastPurchaseDate: item.backupValues.lastPurchaseDate,
        purchaseInterval: item.backupValues.purchaseInterval,
        backupValues: {},
      });
  };

  const createListElement = () => {
    if (listItems.empty) {
      return (
        <div className="list-view__empty list-summary">
          <h2 className="list-summary__heading">
            Your shopping list is currently empty.
          </h2>
          <NavLink to="/add" className="link list-summary__action">
            Add your first item
          </NavLink>
        </div>
      );
    } else {
      return (
        <>
          <ItemFilter filter={filter} setFilter={setFilter} />

          <ul className="shopping-list__list list-reset">
            {itemsToDisplay.map((item) => (
              <ShoppingListItem
                key={item.id}
                item={item}
                checkAsPurchased={checkAsPurchased}
                uncheckAsPurchased={uncheckAsPurchased}
                handleModalOpen={handleModalOpen}
              />
            ))}
          </ul>
        </>
      );
    }
  };

  return <div className="shopping-list">{createListElement()}</div>;
}

export default ShoppingList;
