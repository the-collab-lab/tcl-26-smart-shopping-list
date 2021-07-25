import { NavLink } from 'react-router-dom';
import './NavMenu.css';

const NavMenu = () => {
  return (
    <nav className="container__nav-menu nav-menu" aria-label="Main Navigation">
      <ul className="nav-menu__list">
        <li>
          <NavLink
            exact
            to="/"
            className="nav-menu__item"
            activeClassName="nav-menu__item_current"
          >
            View List
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/add"
            className="nav-menu__item"
            activeClassName="nav-menu__item_current"
          >
            Add Item
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavMenu;
