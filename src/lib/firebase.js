// NOTE: import only the Firebase modules that you need in your app... except
// for the second line, which makes both the linter and react-firebase happy
import firebase from 'firebase/app';
import 'firebase/firestore';

// Initalize Firebase.
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyDlgVTZkjq6HT0pFm7sBiSm60EQ19D2RrI',
    authDomain: 'tcl-26-shopping-list.firebaseapp.com',
    projectId: 'tcl-26-shopping-list',
    storageBucket: 'tcl-26-shopping-list.appspot.com',
    messagingSenderId: '368940430821',
    appId: '1:368940430821:web:5347ad9d833f3a84cd6b0c',
  });
}

const db = firebase.firestore();
export { db };
