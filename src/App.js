// Packages
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

// External Files
import './App.css';

// View Components
import List from './pages/List/List';
import AddItem from './pages/AddItem/AddItem';
import NotFound from './pages/NotFound/NotFound';
import Home from './pages/Home';

// Components
import NavMenu from './components/NavMenu/NavMenu';

function App() {
  const [haveToken, setHaveToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setHaveToken(true);
    }
  }, []);
  return (
    <Router>
      <div className="App container">
        <Switch>
          <Route exact path="/">
            {haveToken ? <Redirect to="/list" /> : <Home />}
          </Route>
          <Route path="/list">
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
