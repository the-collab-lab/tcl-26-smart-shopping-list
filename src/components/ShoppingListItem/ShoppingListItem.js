const ShoppingListItem = ({ item }) => {
  return <li className="shopping-list__item item">{item.itemName}</li>;
};

export default ShoppingListItem;