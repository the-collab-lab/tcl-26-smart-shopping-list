import React from 'react';
import { useHistory } from 'react-router-dom';

function Home({ userToken, saveToken }) {
  let history = useHistory();

  function handleClick(e) {
    saveToken(e);

    if (userToken) {
      history.push('/list');
    }
  }

  return (
    <main>
      <h1>Welcome To Your Smart Shopping List</h1>
      <button type="button" onClick={handleClick}>
        Create a new list
      </button>
    </main>
  );
}

export default Home;
