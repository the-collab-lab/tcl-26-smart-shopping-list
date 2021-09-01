import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { db } from '../../lib/firebase.js';
import { useCollection } from 'react-firebase-hooks/firestore';

import './ListView.css';

import ListHeader from '../../components/ListHeader/ListHeader';
import NavMenu from '../../components/NavMenu/NavMenu';
import ShoppingList from '../../components/ShoppingList/ShoppingList';

const ListView = ({ listId, handleModalOpen, token }) => {
  const [listItems, loading, error] = useCollection(
    db.collection(`lists/${listId}/items`),
  );

  const [showAllDetails, setShowAllDetails] = useState(false);

  const toggleDetailView = () => {
    setShowAllDetails(!showAllDetails);
  };

  return (
    <div className="list-view">
      <Helmet>
        <title>Your Shopping List - Peasy</title>
        <style>{':root { background-color: var(--light-gray); }'}</style>
      </Helmet>

      <ListHeader
        listItems={listItems}
        toggleDetailView={toggleDetailView}
        showAllDetails={showAllDetails}
        token={token}
      />

      <main className="list-view__main">
        <ShoppingList
          listItems={listItems}
          loading={loading}
          error={error}
          listId={listId}
          showAllDetails={showAllDetails}
          handleModalOpen={handleModalOpen}
        />
      </main>

      <NavMenu />
    </div>
  );
};

export default ListView;
