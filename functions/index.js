const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.userSignUp = functions.auth.user().onCreate((user) => {
	console.log("user created,", user.email, user.uid);
	return admin.firestore().collection("users").add({
		email: user.email,
		uid: user.uid,
	});
});

exports.userDelete = functions.auth.user().onDelete((user) => {
	const doc = admin.firestore().collection("users").doc(user.uid);
	return doc.delete();
});

exports.newChat = functions.https.onCall((data, context) => {
	if (!context.auth) {
		throw new functions.https.HttpsError(
			"unauthenticated",
			"Only logged in users can create chats"
		);
	}

	//first check to see if the document exists in the general users array.
	// if it doesn't refer to pubsub. if it does, check if it exists in the particular user's array.
	// if yes, return error. if no, create new doc
	if (admin.firestore().collection("users")) {
		return (
			admin
				.firestore()
				.collection("users")
				// .where()
				// .get()
				// .then((doc) => {
				// 	if (doc.exists) {
				// 		create new chat
				// 	}
				// })
				.doc(context.auth.uid)
				.set(data.email, { merge: true })
				// .update({
				// 	chats: [data.email],
				// })
				.then(() => {})
		);
	} else {
		console.log(`User ${data.email} doesn't exist. Invite via email?`);
	}
	return;
});
