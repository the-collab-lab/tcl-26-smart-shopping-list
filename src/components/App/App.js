import React from 'react';
import './App.css';
import { fb } from '../../lib/firebase.js';
import '@firebase/firestore';
import TestDbWrite from '../TestDbWrite/TestDbWrite';
import TestDbRead from '../TestDbRead/TestDbRead';
function App() {
  return (
    <div>
      <TestDbWrite />
      <TestDbRead />
    </div>
  );
}

export default App;
