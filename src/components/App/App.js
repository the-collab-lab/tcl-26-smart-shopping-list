import React from 'react';
import './App.css';
import '../../lib/firebase.js';
import '@firebase/firestore';

import TestDbWrite from '../TestDbWrite/TestDbWrite';
import TestDbRead from '../TestDbRead/TestDbRead';

function App() {
  return (
    <div className="App">
      <TestDbWrite />
      <TestDbRead />
    </div>
  );
}

export default App;
