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

// Components
import ListView from './pages/ListView/ListView';
import AddItemView from './pages/AddItemView/AddItemView';
import NotFound from './pages/NotFound/NotFound';
import Home from './pages/Home/Home';
import Modal from './components/Modal/Modal.js';

// Functions
import getToken from './lib/tokens';

function App() {
  const [token, setToken] = useState(null);
  const [listId, setListId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({});

  function createList() {
    const token = getToken();

    // before attempting to add new list, make sure token hasn't been used before in the db
    return isTokenValid(token).then((listExists) => {
      if (listExists) {
        // if isTokenValid returns true the token is taken, so try again
        return createList();
      } else {
        // otherwise the token is not already associated with a list, so we can safely use it
        return db
          .collection('lists')
          .add({ token: token }) // add a list and assign it the user's token
          .then((results) => {
            const { id } = results; // get the firestore-generated id from the created list
            if (id === undefined) throw new Error('Failed to create list.');
            return id;
          })
          .then((newListId) => {
            // list successfully created in db, so update listId state and save token to localStorage
            setListId(newListId);
            localStorage.setItem('token', token);
            setToken(token);
            return true;
          });
      }
    });
  }

  // returns listId if token matches a list in db, returns false if no list, throws error on connection problem
  function isTokenValid(token) {
    return db
      .collection('lists')
      .where('token', '==', token)
      .get()
      .then((querySnapshot) => {
        // if there are results and an id property exists
        if (!querySnapshot.empty && 'id' in querySnapshot.docs[0]) {
          return querySnapshot.docs[0].id; // return the listId if it exists
          // check metadata.fromCache to distinguish between no results (invalid token) and a connection issue
        } else if (!querySnapshot.metadata.fromCache) {
          return false;
        } else {
          throw new Error('Connection problem');
        }
      });
  }

  function joinList(shareToken) {
    setToken(shareToken);
    return isTokenValid(shareToken).then((listExists) => {
      if (listExists) {
        setListId(listExists);
        localStorage.setItem('token', shareToken);
        return true;
      } else {
        setToken(null);
        throw new Error('Invalid token');
      }
    });
  }

  const handleModalOpen = (item) => {
    setItemToDelete(item);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const deleteItem = () => {
    db.collection(`lists/${listId}/items`)
      .doc(itemToDelete.id)
      .delete()
      .then(() => {
        handleModalClose();
      })
      .catch((err) => {
        console.error('Error removing document: ', err);
      });
  };

  // on component mounting, look for token in local storage and use it to retrieve the list id
  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
    if (token) {
      isTokenValid(token)
        .then((listExists) => {
          if (listExists) setListId(listExists);
          else {
            localStorage.removeItem('token');
            setToken(null);
          }
        })
        .catch((error) => {
          console.error('Problem getting list: ', error.message);
        });
    }
  }, []);

  return (
    <Router>
      <div
        className="App container"
        aria-hidden={showModal} // if showModal is true, hide the rest of the app
      >
        <Switch>
          <Route exact path="/">
            {listId ? (
              <Redirect to="/list" />
            ) : (
              <Home createList={createList} joinList={joinList} />
            )}
          </Route>
          <Route path="/list">
            {!listId ? (
              <Redirect exact to="/" />
            ) : (
              <ListView
                listId={listId}
                handleModalOpen={handleModalOpen}
                token={token}
              />
            )}
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

      <Modal
        showModal={showModal}
        handleModalClose={handleModalClose}
        deleteItem={deleteItem}
        item={itemToDelete}
      />
    </Router>
  );
}

export default App;
