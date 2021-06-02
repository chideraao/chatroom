import firebase from "firebase";

/**setting up and initialising firebase config */
const firebaseConfig = {
	apiKey: "AIzaSyC0rUzEyjpL-7Q0YcoHsv1MdmpYGHdDsrM",
	authDomain: "chatroom-8c288.firebaseapp.com",
	projectId: "chatroom-8c288",
	storageBucket: "chatroom-8c288.appspot.com",
	messagingSenderId: "474819152066",
	appId: "1:474819152066:web:25bd0d63503709e458935b",
	measurementId: "G-2S47T507QB",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth;
export const db = firebase.database();
