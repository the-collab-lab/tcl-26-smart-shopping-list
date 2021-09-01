import './ListHeader.css';
import peasyLogoMark from '../../images/peasy-logomark.svg';

import ShareToken from '../ShareToken/ShareToken.js';

const ListHeader = ({ listItems, token }) => {
  return (
    <header className="list-view__header list-header">
      <div className="list-header__logo logo">
        <h1 className="logo__heading">
          Peasy
          <img className="logo__image" src={peasyLogoMark} alt="logo" />
        </h1>
      </div>
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

export default ListHeader;
