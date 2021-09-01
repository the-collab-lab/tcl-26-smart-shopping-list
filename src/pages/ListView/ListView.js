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

  const [showDetails, setShowDetails] = useState(false);

  const toggleDetailView = () => {
    setShowDetails(!showDetails);
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
        token={token}
      />

      <main className="container__main">
        <ShoppingList
          listItems={listItems}
          loading={loading}
          error={error}
          listId={listId}
          showDetails={showDetails}
          toggleDetailView={toggleDetailView}
          handleModalOpen={handleModalOpen}
        />
      </main>

      <NavMenu />
    </div>
  );
};

export default ListView;
