const ShoppingListEmpty = ({ openAddPanel }) => {
  return (
    <div className="list-view__empty list-summary">
      <h2 className="list-summary__heading">
        Your shopping list is currently empty.
      </h2>
      <button className="link list-summary__action" onClick={openAddPanel}>
        Add your first item
      </button>
    </div>
  );
};

export default ShoppingListEmpty;
