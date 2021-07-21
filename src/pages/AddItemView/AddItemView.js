import AddItemForm from '../../components/AddItemForm/AddItemForm';

const AddItemView = ({ listId }) => {
  return (
    <main>
      <h1>This is the Add Item component</h1>
      <AddItemForm listId={listId} />
    </main>
  );
};

export default AddItemView;
