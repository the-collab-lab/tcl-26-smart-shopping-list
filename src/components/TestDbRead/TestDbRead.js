import React from 'react';
import { db } from '../../lib/firebase.js';
import { useCollection } from 'react-firebase-hooks/firestore';

function TestDbRead() {
  const [listItems, loading, error] = useCollection(
    db.collection('items').orderBy('createdAt', 'desc'),
  );

  return (
    <div>
      {loading && <>Loading...</>}
      {error && <>Error</>}
      {!loading && listItems && (
        <ul>
          {listItems.docs.map((doc) => {
            const { name, createdAt } = doc.data();
            const date = new Date(createdAt); // add a timestamp to make it clear in this test that a new item is added
            return (
              <li key={doc.id}>{`${name} ${date.toLocaleTimeString(
                'en-US',
              )}`}</li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default TestDbRead;
