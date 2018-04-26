import firebase from 'firebase';

// copy/paste this from your firebase console
var config = {
  apiKey: "AIzaSyAw0tcUwIikGlVNPXKWloZzMYqWkxcy1TU",
  authDomain: "whale-dr.firebaseapp.com",
  databaseURL: "https://whale-dr.firebaseio.com",
  projectId: "whale-dr",
  storageBucket: "whale-dr.appspot.com",
  messagingSenderId: "19626000250"
};

firebase.initializeApp(config);

export const db = firebase.database();
