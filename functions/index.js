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

exports.inviteUser = functions.https.onRequest((data, context) => {
	if (!context.auth) {
		throw new functions.https.HttpsError(
			"unauthenticated",
			"Only logged in users can create chats"
		);
	}
	if (admin.firestore().collection("users")) {
		return "na me";
	} else {
		console.log(`User ${data.email} doesn't exist. Invite via email?`);
	}
	return;
});
