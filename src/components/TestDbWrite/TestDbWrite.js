import React from 'react';
import { db } from '../../lib/firebase.js';

function TestDbWrite() {
  async function handleClick() {
    try {
      await db.collection('items').add({
        name: 'test list item',
        createdAt: Date.now(),
      });
    } catch (err) {
      console.log(err);
    }
  }

  return <button onClick={handleClick}>Add to Firestore</button>;
}

export default TestDbWrite;
