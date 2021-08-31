import { Helmet } from 'react-helmet';

import ListHeader from '../../components/ListHeader/ListHeader';
import NavMenu from '../../components/NavMenu/NavMenu';
import ShoppingList from '../../components/ShoppingList/ShoppingList';

const ListView = ({ listId, handleModalOpen, token }) => {
  return (
    <div className="list-view">
      <Helmet>
        <title>Your List - Peasy</title>
      </Helmet>
      <ListHeader token={token} />

      <main className="list-view__main">
        <ShoppingList listId={listId} handleModalOpen={handleModalOpen} />
      </main>

      <NavMenu />
    </div>
  );
};

export default ListView;
