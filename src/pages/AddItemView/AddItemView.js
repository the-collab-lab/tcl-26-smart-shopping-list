import Header from '../../components/Header/Header';
import NavMenu from '../../components/NavMenu/NavMenu';
import AddItemForm from '../../components/AddItemForm/AddItemForm';

const AddItemView = ({ listId }) => {
  return (
    <>
      <Header />

      <main>
        <AddItemForm listId={listId} />
      </main>

      <NavMenu />
    </>
  );
};

export default AddItemView;
