import firebase from 'firebase';

// copy/paste this from your firebase console
const config = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
};

firebase.initializeApp(config);

export const db = firebase.database();
