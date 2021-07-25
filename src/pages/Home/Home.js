import React from 'react';
import { useHistory } from 'react-router-dom';
import getToken from '../../lib/tokens';

function Home({ userToken, setUserToken }) {
  let history = useHistory();

  function saveToken(e) {
    e.preventDefault();
    const token = getToken();
    localStorage.setItem('token', token);
    setUserToken(token);
    if (userToken) {
      history.push('/list');
    }
  }
  return (
    <main>
      <h1>Welcome To Your Smart Shopping List</h1>
      <button type="button" onClick={saveToken}>
        Create a new list
      </button>
    </main>
  );
}

export default Home;
