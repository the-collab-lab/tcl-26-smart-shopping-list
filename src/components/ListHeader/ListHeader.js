import './ListHeader.css';
import peasyLogoMark from '../../images/peasy-logomark.svg';

import ShareToken from '../ShareToken/ShareToken.js';

const ListHeader = ({ toggleDetailView, showAllDetails, listItems, token }) => {
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
          <div class="list-summary list-header__count">
            <h2 className="list-summary__heading">
              {[
                'You have ',
                <strong className="strong list-summary__strong">
                  {listItems?.docs.length}
                </strong>,
                ' items',
                <span className="list-summary__extra">
                  {' '}
                  on your shopping list
                </span>,
                '.',
              ]}
            </h2>
            <button type="button" className="link" onClick={toggleDetailView}>
              {/* when showAllDetails is false (they're all collapsed), 'Show all item details') */}
              {!showAllDetails
                ? 'Show all item details'
                : 'Hide all item details'}
            </button>
          </div>
        )}
      </div>

      <ShareToken token={token} />
    </header>
  );
};

export default ListHeader;
