import { Helmet } from 'react-helmet';
import { db } from '../../lib/firebase.js';
import { useCollection } from 'react-firebase-hooks/firestore';

import Header from '../../components/Header/Header';
import NavMenu from '../../components/NavMenu/NavMenu';
import ShoppingList from '../../components/ShoppingList/ShoppingList';

const ListView = ({ listId, handleModalOpen, token }) => {
  const [listItems, loading, error] = useCollection(
    db.collection(`lists/${listId}/items`),
  );

  return (
    <>
      <Helmet>
        <title>Your List - Smart Shopping List</title>
      </Helmet>
      <Header listItems={listItems} token={token} />

      <main className="container__main">
        <ShoppingList
          listItems={listItems}
          loading={loading}
          error={error}
          listId={listId}
          handleModalOpen={handleModalOpen}
        />
      </main>

      <NavMenu />
    </>
  );
};

export default ListView;
