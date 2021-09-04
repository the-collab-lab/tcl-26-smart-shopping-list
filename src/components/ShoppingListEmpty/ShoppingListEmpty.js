import { NavLink } from 'react-router-dom';

const ShoppingListEmpty = ({ openAddPanel }) => {
  return (
    <div className="list-view__empty list-summary">
      <h2 className="list-summary__heading">
        Your shopping list is currently empty.
      </h2>
      <button className="link list-summary__action" onClick={openAddPanel}>
        Add your first item
      </button>
      <NavLink
        className="link list-summary__action list-summary__mobile"
        to="/about"
      >
        Help
      </NavLink>
      <NavLink
        className="link list-summary__action list-summary__extra"
        to="/about"
      >
        Learn how Peasy works &raquo;
      </NavLink>
    </div>
  );
};

export default ShoppingListEmpty;
