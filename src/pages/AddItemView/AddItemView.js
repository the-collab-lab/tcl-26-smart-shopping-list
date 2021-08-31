import { Helmet } from 'react-helmet';

import Header from '../../components/Header/Header';
import NavMenu from '../../components/NavMenu/NavMenu';
import AddItemForm from '../../components/AddItemForm/AddItemForm';

const AddItemView = ({ listId }) => {
  return (
    <div className="list-view">
      <Helmet>
        <title>Add Item - Smart Shopping List</title>
      </Helmet>
      <Header />

      <main className="container__main">
        <AddItemForm listId={listId} />
      </main>

      <NavMenu />
    </div>
  );
};

export default AddItemView;
