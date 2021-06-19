const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();
admin.initializeApp();

const { USER_EMAIL, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;

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

exports.inviteUser = functions.https.onCall((data, context) => {
	let email = data.email;

	console.log(USER_EMAIL);
	console.log(CLIENT_ID);
	console.log(CLIENT_SECRET);
	console.log(process.env.REFRESH_TOKEN);

	let transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			type: "OAuth2",
			user: USER_EMAIL,
			clientId: CLIENT_ID,
			clientSecret: CLIENT_SECRET,
			refreshToken: REFRESH_TOKEN,
		},
	});

	//Defining mailOptions
	const mailOptions = {
		from: "okekechidera97@gmail.com",
		to: email,
		subject: `Email invitation from ${context.auth.token.email}`,
		html: "<b>common bitch!!</b>",
	};

	return transporter.sendMail(mailOptions);
});
