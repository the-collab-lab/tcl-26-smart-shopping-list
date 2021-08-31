import { Helmet } from 'react-helmet';

import Header from '../../components/Header/Header';
import NavMenu from '../../components/NavMenu/NavMenu';
import ShoppingList from '../../components/ShoppingList/ShoppingList';

const ListView = ({ listId, handleModalOpen, token }) => {
  return (
    <div className="list-view">
      <Helmet>
        <title>Your List - Smart Shopping List</title>
      </Helmet>
      <Header token={token} />

      <main className="container__main">
        <ShoppingList listId={listId} handleModalOpen={handleModalOpen} />
      </main>

      <NavMenu />
    </div>
  );
};

export default ListView;
