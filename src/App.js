// Packages
import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

// Firestore
import { db } from './lib/firebase.js';

// External Files
import './App.css';

// View Components
import ListView from './pages/ListView/ListView';
import AddItemView from './pages/AddItemView/AddItemView';
import NotFound from './pages/NotFound/NotFound';
import Home from './pages/Home/Home';

// Functions
import getToken from './lib/tokens';

function App() {
  const [listId, setListId] = useState(null);

  function createList() {
    const token = getToken();

    return db
      .collection('lists')
      .add({ token: token })
      .then((results) => {
        const { id } = results;
        if (id === undefined) throw new Error('Failed to create list.');
        return id;
      })
      .then((newListId) => {
        // list successfully created in db, so update listId state and save token to localStorage
        setListId(newListId);
        localStorage.setItem('token', token);
        return true;
      });
  }

  // returns true if token matches a list in db, returns false if no list, throws error on connection problem
  function isTokenValid(token) {
    return db
      .collection('lists')
      .where('token', '==', token)
      .get()
      .then((querySnapshot) => {
        // if there are results and an id property exists
        if (!querySnapshot.empty && 'id' in querySnapshot.docs[0]) {
          setListId(querySnapshot.docs[0].id);
          return true;

          // check metadata.fromCache to distinguish between no results (invalid token) and a connection issue
        } else if (!querySnapshot.metadata.fromCache) {
          return false;
        } else {
          throw new Error('Connection problem');
        }
      });
  }

  function joinList(shareToken) {
    return isTokenValid(shareToken).then((listExists) => {
      if (listExists) {
        localStorage.setItem('token', shareToken);
        return true;
      } else throw new Error('Invalid token');
    });
  }

  // on component mounting, look for token in local storage and use it to retrieve the list id
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      isTokenValid(token)
        .then((listExists) => {
          if (listExists !== true) localStorage.removeItem('token');
        })
        .catch((error) => {
          console.log('Error getting list: ', error);
        });
    }
  }, []);

  return (
    <Router>
      <div className="App container">
        <Switch>
          <Route exact path="/">
            {listId ? (
              <Redirect to="/list" />
            ) : (
              <Home createList={createList} joinList={joinList} />
            )}
          </Route>
          <Route path="/list">
            {!listId ? <Redirect exact to="/" /> : <ListView listId={listId} />}
          </Route>
          <Route path="/add">
            {!listId ? (
              <Redirect exact to="/" />
            ) : (
              <AddItemView listId={listId} />
            )}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
