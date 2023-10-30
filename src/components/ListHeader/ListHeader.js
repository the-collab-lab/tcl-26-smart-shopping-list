import { NavLink } from 'react-router-dom';

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

        {listItems?.docs?.length === 0 ? (
          ''
        ) : (
          <div className="list-summary list-header__count">
            <h2 className="list-summary__heading">
              You have&nbsp;
              <strong className="strong list-summary__strong">
                {listItems?.docs?.length === 1
                  ? '1 item'
                  : `${listItems?.docs?.length} items`}
              </strong>
              &nbsp;
              <span className="list-summary__extra">on your shopping list</span>
            </h2>
            <button
              type="button"
              className="link list-summary__action"
              onClick={toggleDetailView}
            >
              {/* when showAllDetails is false (they're all collapsed), 'Show all item details') */}
              {!showAllDetails
                ? 'Show all item details'
                : 'Hide all item details'}
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
        )}
      </div>

      <ShareToken token={token} />
    </header>
  );
};

export default ListHeader;
