import ShoppingList from '../../components/ShoppingList/ShoppingList';

const ListView = ({ listId }) => {
  return (
    <main>
      <h1>This is the List component</h1>
      <ShoppingList listId={listId} />
    </main>
  );
};

export default ListView;
