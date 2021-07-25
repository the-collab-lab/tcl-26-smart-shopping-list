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
import Home from './pages/Home/Home';

// Components
import NavMenu from './components/NavMenu/NavMenu';

// Functions

function App() {
  const [userToken, setUserToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUserToken(token);
    }
  }, []);
  return (
    <Router>
      <div className="App container">
        <Switch>
          <Route exact path="/">
            {userToken ? (
              <Redirect to="/list" />
            ) : (
              <Home userToken={userToken} setUserToken={setUserToken} />
            )}
          </Route>
          <Route path="/list">
            {!userToken ? <Redirect exact to="/" /> : <List />}
          </Route>
          <Route path="/add">
            {!userToken ? <Redirect exact to="/" /> : <AddItem />}
          </Route>
          <Route component={NotFound} />
        </Switch>

        <NavMenu />
      </div>
    </Router>
  );
}

export default App;
