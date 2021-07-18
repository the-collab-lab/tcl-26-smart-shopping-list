// Packages
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom';

// External Files
import './App.css';

// Components
import List from './pages/List/List';
import AddItem from './pages/AddItem/AddItem';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <List />
          </Route>
          <Route path="/add">
            <AddItem />
          </Route>
          <Route component={NotFound} />
        </Switch>

        <nav className="menu" aria-label="Main Navigation">
          <ul className="menu-list">
            <li>
              <NavLink exact to="/" activeClassName="menu-item_current">
                View List
              </NavLink>
            </li>
            <li>
              <NavLink to="/add" activeClassName="menu-item_current">
                Add Item
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </Router>
  );
}

export default App;
