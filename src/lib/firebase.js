// NOTE: import only the Firebase modules that you need in your app... except
// for the second line, which makes both the linter and react-firebase happy
import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD38OqGDPdVpQJ071ndKlQ2HQXVrl6E1hc',
  authDomain: 'peasy-aa52a.firebaseapp.com',
  projectId: 'peasy-aa52a',
  storageBucket: 'peasy-aa52a.appspot.com',
  messagingSenderId: '960539340910',
  appId: '1:960539340910:web:d504d4aee09c7956a1367f',
};

const firebaseInstance = firebase.initializeApp(firebaseConfig);

const db = firebaseInstance.firestore();
export { db };
