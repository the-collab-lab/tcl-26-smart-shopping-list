import React from 'react';
import firebase from 'firebase/app';
import { useCollection } from 'react-firebase-hooks/firestore';

function TestDbRead() {
  const [value, loading, error] = useCollection(
    firebase.firestore().collection('items'),
  );

  return (
    <div>
      {loading && <>Loading...</>}
      {error && <>Error</>}
      {value && (
        <ul>
          {value.docs.map((doc, index) => (
            <li key={index}>{JSON.stringify(doc.data())}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TestDbRead;
