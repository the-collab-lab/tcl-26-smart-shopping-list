import './ListHeader.css';
import peasyLogoMark from '../../images/peasy-logomark.svg';

import ShareToken from '../ShareToken/ShareToken.js';

const ListHeader = ({ listItems, token }) => {
  return (
    <header className="list-view__header list-header">
      <div className="list-header__main">
        <div className="list-header__logo logo">
          <h1 className="logo__heading">
            Peasy
            <img className="logo__image" src={peasyLogoMark} alt="logo" />
          </h1>
        </div>

        {listItems?.docs.length === 0 ? (
          ''
        ) : (
          <div class="list-summary">
            <h2 className="list-summary__heading">
              {[
                'You have ',
                <strong className="strong list-summary__strong">
                  {listItems?.docs.length}
                </strong>,
                ' items on your shopping list.',
              ]}
            </h2>
            {/* actions go here with class .link and .list-summary__action */}
          </div>
        )}
      </div>

      <ShareToken token={token} />
    </header>
  );
};

export default ListHeader;
