import { Helmet } from 'react-helmet';
import { db } from '../../lib/firebase.js';
import { useCollection } from 'react-firebase-hooks/firestore';

import './ListView.css';

import Loader from '../../components/Loader/Loader';
import ListHeader from '../../components/ListHeader/ListHeader';
import NavMenu from '../../components/NavMenu/NavMenu';
import ShoppingList from '../../components/ShoppingList/ShoppingList';

const ListView = ({ listId, handleModalOpen, token }) => {
  const [listItems, loading, error] = useCollection(
    db.collection(`lists/${listId}/items`),
  );

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
          <ListHeader listItems={listItems} token={token} />

          <main className="list-view__main">
            <ShoppingList
              listItems={listItems}
              listId={listId}
              handleModalOpen={handleModalOpen}
            />
          </main>

          <NavMenu />
        </>
      )}
    </div>
  );
};

export default ListView;
