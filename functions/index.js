const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.userSignUp = functions.auth.user().onCreate((user) => {
	console.log("user created,", user.email, user.uid);
	return admin.firestore().collection("users").doc(user.uid).set({
		email: user.email,
		chats: [],
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
	return admin.firestore().collection("users").doc(context.auth.uid).update({
		chats: [],
	});
});
