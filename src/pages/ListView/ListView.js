import { Helmet } from 'react-helmet';

import Header from '../../components/Header/Header';
import NavMenu from '../../components/NavMenu/NavMenu';
import ShoppingList from '../../components/ShoppingList/ShoppingList';

const ListView = ({ listId, handleModalOpen }) => {
  return (
    <>
      <Helmet>
        <title>Your List - Smart Shopping List</title>
      </Helmet>
      <Header />

      <main className="container__main">
        <ShoppingList listId={listId} handleModalOpen={handleModalOpen} />
      </main>

      <NavMenu />
    </>
  );
};

export default ListView;
