// Packages
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom';

// External Files
import logo from './logo.svg';
import './App.css';

// Components
import List from './components/List';
import AddItem from './components/AddItem';

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
        </Switch>

        <NavLink exact to="/" activeClassName="selected">
          <button>View List</button>
        </NavLink>

        <NavLink to="/add" activeClassName="selected">
          <button>Add Item</button>
        </NavLink>
      </div>
    </Router>
  );
}

export default App;
