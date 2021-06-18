const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

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

exports.inviteUser = functions.https.onCall((data, context) => {
	if (!context.auth) {
		throw new functions.https.HttpsError(
			"unauthenticated",
			"Feature only available to users with accounts."
		);
	}

	let transporter = nodemailer.createTransport({
		host: "smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: "1aca49cbea3bcd",
			pass: "57e30686aa0e28",
		},
	});

	//Defining mailOptions
	const mailOptions = {
		from: "okekechidera64@yahoo.com", //Adding sender's email
		to: data.email, //Getting recipient's email by query string
		subject: `Email invitation from ${context.auth.token.email}`, //Email subject
		html: "<b>common bitch!!</b>", //Email content in HTML
	};

	return transporter.sendMail(mailOptions);
});

// return transporter.sendMail(mailOptions, (err, info) => {
// 	if(err){
// 		return res.send(err.toString());
// 	}
// 	return res.send('Email sent succesfully');
// });
