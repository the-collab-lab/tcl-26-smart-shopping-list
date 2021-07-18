// Packages
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// External Files
import './App.css';

// View Components
import List from './pages/List/List';
import AddItem from './pages/AddItem/AddItem';
import NotFound from './pages/NotFound/NotFound';

// Components
import NavMenu from './components/NavMenu/NavMenu';

function App() {
  return (
    <Router>
      <div className="App container">
        <Switch>
          <Route exact path="/">
            <List />
          </Route>
          <Route path="/add">
            <AddItem />
          </Route>
          <Route component={NotFound} />
        </Switch>

        <NavMenu />
      </div>
    </Router>
  );
}

export default App;
