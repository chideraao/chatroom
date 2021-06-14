const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
	functions.logger.info("Hello logs!", { structuredData: true });
	response.send("Hello from Firebase!");
});

exports.deraBoy = functions.auth.user().onCreate((user) => {
	console.log("user created", user.email, user.uid);
});

exports.deraTheBoy = functions.auth.user().onDelete((user) => {
	console.log("user deleted", user.email, user.uid);
});

exports.makeUppercase = functions.firestore
	.document("/messages/{documentId}")
	.onCreate((snap, context) => {
		// console.log(snap.data().key);
		const key = snap.data().key;
		console.log("Uppercasing", context.params.documentId, key);
		const uppercase = key.toUpperCase();
		return snap.ref.set({ uppercase }, { merge: true });
	});
