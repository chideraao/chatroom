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
		html: `
		<div
		style="
			background-color: rgb(233, 230, 230);
			display: flex;
			justify-content: center;
			font-family: Arial, Helvetica, sans-serif;
		"
	>
		<div
			role="presentation"
			style="
				background-color: #fff;
				border-radius: 5px;
				box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
				padding: 20px;
				margin: auto;
				color: #333;
				height: 100%;
				max-width: 35rem;
			"
		>
			<table role="presentation" class="logo-img">
				<tr>
					<td>
						<div style="max-width: 100%; max-height: 100%">
							<a href="https://dhera-gram.firebaseapp.com"
								><img height="56" src="cid:logo@dhera.com" alt="logo"/> </a>
						</div>
					</td>
				</tr>
			</table>
			<table role="presentation" style="display: flex; align-items: center">
				<tr>
					<td align="center">
						<h1 style="font-size: 2.5rem; margin: 0.5rem 0">
							Welcome to DheraGram!
						</h1>
					</td>
					<td>
						<div style="height: 5.5rem; width: 5rem">
							<img
								height="80"
								width="80"
								src="https://pngimg.com/uploads/confetti/confetti_PNG86957.png"
								alt="confetti"
							/>
						</div>
					</td>
				</tr>
			</table>

			<table role="presentation" class="">
				<tr>
					<td>
						<p>Hey there,</p>
						<p>
							I’m Chidera, the creator/developer of DheraGram and I’d like to
							personally thank you for taking time to sign up for my project.
						</p>
						<p>
							DheraGram is a chat application I created as a side project to
							blah blah blah. I’d love to hear what you think of project and if
							there is anything I can improve on.
						</p>
						<p>
							If you have any suggestions, please reply to this email. I look
							forward to hearing from you!
						</p>
						<p>Chidera</p>
					</td>
				</tr>
			</table>
		</div>
	</div>`,
		attachments: [
			{
				filename: "logo_true.jpeg",
				path: "../src/assets/logo/logo_true.jpeg",
				cid: "logo@dhera.com",
			},
		],
	};

	return admin
		.firestore()
		.collection("users")
		.doc(user.uid)
		.set({
			email: user.email,
			uid: user.uid,
			recentEmojis: [],
			photoURL: user.photoURL,
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
