import React from 'react';
import './App.css';
import { fb } from '../../lib/firebase.js';
import '@firebase/firestore';
import TestDbWrite from '../TestDbWrite/TestDbWrite';
function App() {
  return (
    <div>
      <TestDbWrite />
    </div>
  );
}

export default App;
