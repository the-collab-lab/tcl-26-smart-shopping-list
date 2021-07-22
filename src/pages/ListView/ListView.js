import Header from '../../components/Header/Header';
import NavMenu from '../../components/NavMenu/NavMenu';
import ShoppingList from '../../components/ShoppingList/ShoppingList';

const ListView = ({ listId }) => {
  return (
    <>
      <Header />

      <main className="container__main">
        <ShoppingList listId={listId} />
      </main>

      <NavMenu />
    </>
  );
};

export default ListView;
