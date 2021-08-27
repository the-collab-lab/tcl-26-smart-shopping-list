import ShareToken from '../ShareToken/ShareToken.js';

import './Header.css';

const Header = ({ token }) => {
  return (
    <header className="container__header header">
      <h1 className="header__logo">Smart Shopping List</h1>
      <ShareToken token={token} />
    </header>
  );
};

export default Header;
