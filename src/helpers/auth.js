import { auth } from "../services/firebase.js";

/**setting up firebase auth */
export function signUp(email, password) {
	return auth().createUserWithEmailAndPassword(email, password);
}

export function signIn(email, password) {
	return auth().signInWithEmailAndPassword(email, password);
}

export function signInWithGoogle() {
	const provider = new auth.GoogleAuthProvider();
	return auth().signInWithPopup(provider);
}

export function signInWithGithub() {
	const provider = new auth.GithubAuthProvider();
	return auth().signInWithPopup(provider);
}

/** {
  "rules": {
    "chats":{
		".read": "auth != null"
      ".write": "auth != null"
    }
  }
}*/
