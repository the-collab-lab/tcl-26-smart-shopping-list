import TestDbWrite from '../../components/TestDbWrite/TestDbWrite';
import AddItemForm from '../../components/AddItemForm/AddItemForm';

const AddItemView = () => {
  return (
    <main>
      <h1>This is the Add Item component</h1>
      <AddItemForm />
      <TestDbWrite />
    </main>
  );
};

export default AddItemView;
