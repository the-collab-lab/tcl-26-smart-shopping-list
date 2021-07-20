// Packages
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// External Files
import './App.css';

// View Components
import ListView from './pages/ListView/ListView';
import AddItemView from './pages/AddItemView/AddItemView';
import NotFound from './pages/NotFound/NotFound';

// Components
import NavMenu from './components/NavMenu/NavMenu';

function App() {
  return (
    <Router>
      <div className="App container">
        <Switch>
          <Route exact path="/">
            <ListView />
          </Route>
          <Route path="/add">
            <AddItemView />
          </Route>
          <Route component={NotFound} />
        </Switch>

        <NavMenu />
      </div>
    </Router>
  );
}

export default App;
