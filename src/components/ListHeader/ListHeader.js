import './ListHeader.css';
import peasyLogoMark from '../../images/peasy-logomark.svg';

import ShareToken from '../ShareToken/ShareToken.js';

const ListHeader = ({ toggleDetailView, token }) => {
  return (
    <header className="list-view__header list-header">
      <div className="list-header__logo logo">
        <h1 className="logo__heading">
          Peasy
          <img className="logo__image" src={peasyLogoMark} alt="logo" />
        </h1>
      </div>

      <button type="button" className="link" onClick={toggleDetailView}>
        Show all item details
      </button>

      <ShareToken token={token} />
    </header>
  );
};

export default ListHeader;
