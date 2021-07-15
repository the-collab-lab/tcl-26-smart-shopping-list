import React from 'react';
import './App.css';

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
