import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import firebase from 'firebase/app';
import { db } from '../../lib/firebase.js';
import { useCollection } from 'react-firebase-hooks/firestore';

import calculateEstimate from '../../lib/estimates.js';
import { DateTime } from 'luxon';

import ShoppingListItem from '../ShoppingListItem/ShoppingListItem.js';

function ShoppingList({ listId }) {
  const [listItems, loading, error] = useCollection(
    db.collection(`lists/${listId}/items`),
  );

  const [filter, setFilter] = useState('');

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
    const newPurchaseDate = DateTime.fromSeconds(Math.floor(Date.now() / 1000));

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

    db.collection(`lists/${listId}/items`)
      .doc(item.id)
      .update({
        lastPurchaseDate: new firebase.firestore.Timestamp(
          newPurchaseDate.toSeconds(),
          0,
        ),
        numberOfPurchases: firebase.firestore.FieldValue.increment(1),
        purchaseInterval: newPurchaseInterval,
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInput = (e) => {
    setFilter(e.target.value);
  };

  const getDaysToPurchase = (item) => {
    let nextPurchaseDate;
    if (item.lastPurchaseDate?.seconds) {
      // if the item has been purchased before, next purchase date is [purchaseInterval] days from the lastPurchaseDate
      nextPurchaseDate = DateTime.fromSeconds(
        item.lastPurchaseDate.seconds,
      ).plus({ days: item.purchaseInterval });
    } else if (item.createdAt?.seconds) {
      // if there's no purchase history, estimate it will be bought [purchaseInterval] days from when item was created
      // (user provides this info at item creation)
      nextPurchaseDate = DateTime.fromSeconds(item.createdAt.seconds).plus({
        days: item.purchaseInterval,
      });
    } else return null;

    const currentDate = DateTime.fromSeconds(Math.floor(Date.now() / 1000));
    const daysRemaining = nextPurchaseDate.diff(currentDate, ['days']);
    return Math.round(daysRemaining.as('days'));
  };

  const isItemInactive = (item) => {
    const currentDate = DateTime.fromSeconds(Math.floor(Date.now() / 1000));

    if (item.lastPurchaseDate?.seconds) {
      return (
        currentDate
          .diff(DateTime.fromSeconds(item.lastPurchaseDate.seconds), ['days'])
          .as('days') >=
        2 * item.purchaseInterval
      );
    } else if (item.createdAt?.seconds) {
      return (
        currentDate
          .diff(DateTime.fromSeconds(item.createdAt.seconds), ['days'])
          .as('days') >=
        2 * item.purchaseInterval
      );
    } else return null;
  };

  const sortListItems = (itemA, itemB) => {
    // if items being compared are both inactive, or neither is inactive, sort by days until next purchase
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
  };

  const getItemStatus = (item) => {
    if (isItemInactive(item)) return 'inactive';
    if (item.daysToPurchase < 7) return 'soon';
    if (item.daysToPurchase >= 7 && item.daysToPurchase <= 30)
      return 'kind-of-soon';
    if (item.daysToPurchase > 30) return 'not-soon';
  };

  const itemsToDisplay = listItems?.docs
    .filter((doc) => new RegExp(filter, 'i').test(doc.data().itemName))
    .map((doc) => {
      const item = doc.data();
      item.id = doc.id;
      item.daysToPurchase = getDaysToPurchase(item);
      item.status = getItemStatus(item);
      return item;
    })
    .sort(sortListItems);

  const createListElement = () => {
    if (listItems.empty) {
      return (
        <>
          <p>Your shopping list is currently empty.</p>
          <NavLink to="/add" className="button">
            Add Item
          </NavLink>
        </>
      );
    } else {
      return (
        <>
          <div className="filter">
            <label htmlFor="filterInput" className="filter__label label">
              Filter items
            </label>
            <input
              type="text"
              id="filterInput"
              name="filterInput"
              value={filter}
              onChange={handleInput}
              className="filter__text-field text-field"
            />
            <button
              type="button"
              aria-label="clear"
              className="filter__button"
              onClick={() => setFilter('')}
            >
              Clear Filter
            </button>
          </div>

          <ul className="shopping-list__list list-reset">
            {itemsToDisplay.map((item) => (
              <ShoppingListItem
                key={item.id}
                item={item}
                checkAsPurchased={checkAsPurchased}
              />
            ))}
          </ul>
        </>
      );
    }
  };

  return (
    <div className="shopping-list">
      {loading && (
        <div className="shopping-list__notice notice notice_type_loading">
          Loading...
        </div>
      )}

      {error && (
        <div className="shopping-list__notice notice notice_type_error">
          Error
        </div>
      )}

      {/* !loading is required or else listItems is undefined */}
      {!loading && createListElement()}
    </div>
  );
}

export default ShoppingList;
