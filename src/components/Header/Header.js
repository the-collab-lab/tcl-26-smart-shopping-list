import './Header.css';

import ShareToken from '../ShareToken/ShareToken.js';

const Header = ({ listItems, token }) => {
  return (
    <header className="container__header header">
      <h1 className="header__logo">Smart Shopping List</h1>
      {listItems?.docs.length === 0 ? (
        ''
      ) : (
        <h4>{`You have ${listItems?.docs.length} items on your shopping list.`}</h4>
      )}
      <ShareToken token={token} />
    </header>
  );
};

export default Header;
