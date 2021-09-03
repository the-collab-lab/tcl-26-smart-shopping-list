import { useState } from 'react';

import { Helmet } from 'react-helmet';
import { db } from '../../lib/firebase.js';
import { useCollection } from 'react-firebase-hooks/firestore';
import { DateTime } from 'luxon';

import './ListView.css';

import Loader from '../../components/Loader/Loader';
import ListHeader from '../../components/ListHeader/ListHeader';
import ItemFilter from '../../components/ItemFilter/ItemFilter.js';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import ShoppingListEmpty from '../../components/ShoppingListEmpty/ShoppingListEmpty';
import AddItemForm from '../../components/AddItemForm/AddItemForm';

const ListView = ({ listId, handleModalOpen, token }) => {
  const [listItems, loading, error] = useCollection(
    db.collection(`lists/${listId}/items`),
  );

  const [showAddItem, setShowAddItem] = useState(false);

  const [filter, setFilter] = useState('');

  const [showAllDetails, setShowAllDetails] = useState(false);

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
      item.nextPurchaseDate = getNextPurchase(item);
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
  function getNextPurchase(item) {
    if (item.lastPurchaseDate?.seconds) {
      // if the item has been purchased before, next purchase date is `purchaseInterval` days from the lastPurchaseDate
      return DateTime.fromSeconds(item.lastPurchaseDate.seconds).plus({
        days: item.purchaseInterval,
      });
    } else if (item.createdAt?.seconds) {
      // if there's no purchase history, estimate it will be bought `purchaseInterval` days from when item was created
      // (user provides this info at item creation)
      return DateTime.fromSeconds(item.createdAt.seconds).plus({
        days: item.purchaseInterval,
      });
    } else return null;
  }

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

  return (
    <div className="list-view">
      <Helmet>
        <title>Your Shopping List - Peasy</title>
        <style>{':root { background-color: var(--light-gray); }'}</style>
      </Helmet>

      {loading && <Loader />}

      {error && (
        <div className="shopping-list__notice notice notice_type_error">
          Sorry, something went wrong!
        </div>
      )}

      {!loading && (
        <>
          <ListHeader
            listItems={listItems}
            toggleDetailView={() => setShowAllDetails(!showAllDetails)}
            showAllDetails={showAllDetails}
            token={token}
          />

          <main className="list-view__main">
            <button
              className="list-view__add-button"
              onClick={() => setShowAddItem(!showAddItem)}
              aria-label="Open Add Item Form"
              aria-expanded={showAddItem}
            >
              +
            </button>
            {listItems.empty ? (
              <ShoppingListEmpty
                openAddPanel={() => setShowAddItem(!showAddItem)}
              />
            ) : (
              <>
                <ItemFilter filter={filter} setFilter={setFilter} />

                <ShoppingList
                  listId={listId}
                  listItems={itemsToDisplay}
                  showAllDetails={showAllDetails}
                  handleModalOpen={handleModalOpen}
                />
              </>
            )}
          </main>

          <AddItemForm
            db={db}
            listId={listId}
            listItems={listItems}
            showAddItem={showAddItem}
          />
        </>
      )}
    </div>
  );
};

export default ListView;
