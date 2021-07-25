// Packages
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// Firestore
import { db } from './lib/firebase.js';

// External Files
import './App.css';

// View Components
import ListView from './pages/ListView/ListView';
import AddItemView from './pages/AddItemView/AddItemView';
import NotFound from './pages/NotFound/NotFound';

function App() {
  const [listId, setListId] = useState(null);

  // on component mounting, look for token in local storage and use it to retrieve the list id
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
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
            <ListView listId={listId} />
          </Route>
          <Route path="/add">
            <AddItemView listId={listId} />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
