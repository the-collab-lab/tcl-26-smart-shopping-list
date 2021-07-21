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

// Components
import NavMenu from './components/NavMenu/NavMenu';

function App() {
  const [listDocumentId, setListDocumentId] = useState(null);

  // on component mounting, look for token in local storage and use it to retrieve the list id
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // find the list in Firestore associated with the stored token from local storage
      db.collection('lists')
        .where('token', '==', token)
        .get()
        .then((querySnapshot) => {
          // for some reason, extracting this array seems necessary to avoid errors?
          const documents = querySnapshot.docs;

          // check if the expected data is returned
          if (
            Array.isArray(documents) &&
            documents.length &&
            typeof documents[0] === 'object'
          ) {
            setListDocumentId(documents[0].id); // save the list id for later
          }
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
            <ListView />
          </Route>
          <Route path="/add">
            <AddItemView listId={listDocumentId} />
          </Route>
          <Route component={NotFound} />
        </Switch>

        <NavMenu />
      </div>
    </Router>
  );
}

export default App;
