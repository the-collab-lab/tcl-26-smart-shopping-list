import './Header.css';

import ShareToken from '../ShareToken/ShareToken.js';

const Header = ({ listItems, token }) => {
  return (
    <header className="container__header header">
      <h1 className="header__logo">Smart Shopping List</h1>
      {listItems?.docs.length === 0 ? (
        ''
      ) : (
        <p className="header__count">
          {[
            'You have ',
            <strong className="strong">{listItems?.docs.length}</strong>,
            ' items on your shopping list.',
          ]}
        </p>
      )}
      <ShareToken token={token} />
    </header>
  );
};

export default Header;
