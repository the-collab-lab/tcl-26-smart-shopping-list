import React from 'react';
import firebase from 'firebase/app';

function TestDbWrite() {
  async function handleClick() {
    try {
      await firebase
        .firestore()
        .collection('items')
        .add({ name: 'test list item' });
    } catch (err) {
      console.log(err);
    }
  }

  return <button onClick={handleClick}>Add to Firestore</button>;
}

export default TestDbWrite;
