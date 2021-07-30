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
  const [userToken, setUserToken] = useState('');

  function saveToken(e) {
    e.preventDefault();
    const token = getToken();
    localStorage.setItem('token', token);
    setUserToken(token);
  }

  // on component mounting, look for token in local storage and use it to retrieve the list id
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setUserToken(token);

      // find the list in Firestore associated with the stored token from local storage
      db.collection('lists')
        .where('token', '==', token)
        .get()
        .then((querySnapshot) => {
          // if there are results and an id property exists
          if (!querySnapshot.empty && 'id' in querySnapshot.docs[0]) {
            setListId(querySnapshot.docs[0].id); // save the list id for later
          }
        })
        .catch((error) => {
          console.log('Error getting list: ', error);
        });
    }
  }, [listId]);

  return (
    <Router>
      <div className="App container">
        <Switch>
          <Route exact path="/">
            {userToken ? (
              <Redirect to="/list" />
            ) : (
              <Home
                userToken={userToken}
                setUserToken={setUserToken}
                saveToken={saveToken}
              />
            )}
          </Route>
          <Route path="/list">
            {!userToken ? (
              <Redirect exact to="/" />
            ) : (
              <ListView listId={listId} />
            )}
          </Route>
          <Route path="/add">
            {!userToken ? (
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
