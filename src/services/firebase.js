/* eslint-disable no-restricted-globals */
import firebase from "firebase";

/**setting up and initialising firebase config */

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth;
export const db = firebase.database();
export const store = firebase.firestore();

// if (location.hostname === "localhost") {
//   store.useEmulator("localhost", 8080);
// }

// if (location.hostname === "localhost") {
//   db.useEmulator("localhost", 9000);
// }
// if (location.hostname === "localhost") {
//   auth().useEmulator("http://localhost:9099");
// }

// if (window.location.hostname === "localhost") {
//   firebase.functions().useEmulator("localhost", 5001);
// }
