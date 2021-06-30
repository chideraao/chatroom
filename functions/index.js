const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

/** defining and destructuring environments config for firebase functions */
let { useremail, refreshtoken, clientid, clientsecret } =
	functions.config().gmail;

let transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		type: "OAuth2",
		user: useremail,
		clientId: clientid,
		clientSecret: clientsecret,
		refreshToken: refreshtoken,
	},
});

exports.userSignUp = functions.auth.user().onCreate((user) => {
	//Defining mailOptions
	const mailOptions = {
		from: "okekechidera97@gmail.com",
		to: user.email,
		subject: "Thanks for Signing up",
		html: "<b>common bitch!!</b>",
	};

	return admin
		.firestore()
		.collection("users")
		.add({
			email: user.email,
			uid: user.uid,
			recentEmojis: [],
		})
		.then(() => {
			transporter.sendMail(mailOptions);
		})
		.catch((err) => {
			console.log(err);
		});
});

exports.userDelete = functions.auth.user().onDelete((user) => {
	const doc = admin.firestore().collection("users").doc(user.uid);
	return doc.delete();
});

exports.inviteUser = functions.https.onCall((data, context) => {
	let email = data.email;

	//Defining mailOptions
	const mailOptions = {
		from: "okekechidera97@gmail.com",
		to: email,
		subject: `Email invitation from ${context.auth.token.email}`,
		html: "<b>common bitch!!</b>",
	};

	return transporter.sendMail(mailOptions);
});

exports.listActiveChats = functions.https.onCall(async (data, context) => {
	const docPath = data.docPath;

	const collections = await admin.firestore().doc(docPath).listCollections();
	const collectionIds = collections.map((col) => col.id);

	return { collections: collectionIds };
});
