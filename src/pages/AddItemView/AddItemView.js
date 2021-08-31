import { Helmet } from 'react-helmet';

import ListHeader from '../../components/ListHeader/ListHeader';
import NavMenu from '../../components/NavMenu/NavMenu';
import AddItemForm from '../../components/AddItemForm/AddItemForm';

const AddItemView = ({ listId }) => {
  return (
    <div className="list-view">
      <Helmet>
        <title>Add Item - Smart Shopping List</title>
      </Helmet>
      <ListHeader />

      <main className="list-view__main">
        <AddItemForm listId={listId} />
      </main>

      <NavMenu />
    </div>
  );
};

export default AddItemView;
