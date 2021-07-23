import firebase from "firebase";

/**setting up and initialising firebase config */
const firebaseConfig = {
	apiKey: "AIzaSyAeoPiWLHXXkUuVYSA5BG2Oh7oF64vQ3H0",
	authDomain: "dhera-gram.firebaseapp.com",
	projectId: "dhera-gram",
	storageBucket: "dhera-gram.appspot.com",
	messagingSenderId: "577218277226",
	appId: "1:577218277226:web:6055a44e41f9aa7f73bf13",
	measurementId: "G-XLJYK0HW1J",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth;
export const db = firebase.database();
export const store = firebase.firestore();

// // eslint-disable-next-line no-restricted-globals
// if (location.hostname === "localhost") {
// 	store.useEmulator("localhost", 8080);
// }

// // eslint-disable-next-line no-restricted-globals
// if (location.hostname === "localhost") {
// 	db.useEmulator("localhost", 9000);
// }
// // eslint-disable-next-line no-restricted-globals
// if (location.hostname === "localhost") {
// 	auth().useEmulator("http://localhost:9099");
// }

// if (window.location.hostname === "localhost") {
// 	firebase.functions().useEmulator("localhost", 5001);
// }
