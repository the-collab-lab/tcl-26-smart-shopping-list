import React from 'react';
import getToken from '../../lib/tokens';

const Home = () => {
  const saveToken = () => {
    const token = getToken();
    localStorage.setItem('token', token);
    window.location.reload(false);
  };
  return (
    <main>
      <h1>Welcome To Your Smart Shopping List</h1>
      <button onClick={saveToken}>Create a new list</button>
    </main>
  );
};

export default Home;
