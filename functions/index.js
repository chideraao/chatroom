const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const path = require("path");

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
							<a href="https://dhera-gram.web.app"
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
				  I’m Dera, the creator/developer of DheraGram and I’d like to
				  personally thank you for taking the time to sign up for my
				  project.
				</p>
				<p>
				  DheraGram is a functional chat application built with ReactJS and
				  Firebase. It consists of a general group chat feature for all
				  users, as well as a private chat option. I’d love to hear what you think of the project.
				</p>
				<p>
				  If you have any suggestions, please reply to this email. I look
				  forward to hearing from you!
				</p>
				<p>Dera.</p>
			  </td>
			</tr>
		  </table>
		</div>
	</div>`,
    attachments: [
      {
        filename: "logo_true.jpeg",
        path: path.join(__dirname, "./images/logo_true.jpeg"),
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
      admin
        .firestore()
        .collection(user.email)
        .doc("chats")
        .collection("okekechidera97@gmail.com")
        .add({
          content: "👋",
          timestamp: Date.now(),
        });
    })
    .then(() => {
      admin
        .firestore()
        .collection(user.email)
        .doc("chats")
        .collection("okekechidera97@gmail.com")
        .add({
          content:
            "Hey there, a warm welcome to you. It is a pleasure to have you on board!",
          timestamp: Date.now(),
        });
    })
    .then(() => {
      admin
        .firestore()
        .collection(user.email)
        .doc("okekechidera97@gmail.com")
        .set(
          {
            content:
              "Hey there, a warm welcome to you. It is a pleasure to have you on board!",
            email: "okekechidera97@gmail.com",
            providerURL:
              "https://lh3.googleusercontent.com/a/AATXAJxGBtZ_UfDyG2snGHEMLNX0xcA8kivhnBfwhYzp=s96-c",
            timestamp: Date.now(),
          },
          { merge: true }
        );
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
  let {email, photoURL, displayName} = data;

  //Defining mailOptions
  const mailOptions = {
    from: "okekechidera97@gmail.com",
    to: email,
    subject: `Email invitation from ${context.auth.token.email}`,
    html: `<div
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
						<div style="max-width: 100%; max-height: 100%; margin-left: 16px">
							<a href="https://dhera-gram.web.app"
								><img height="56" src="cid:logo@dhera.com" alt="logo"/></a>
						</div>
					</td>
				</tr>
			</table>
			<table role="presentation" style="align-items: center; margin: 0 auto">
				<tr>
					<td align="center">
						<div style="height: 3.5rem; width: 5rem">
							<img
								height="50"
								width="50"
								style="height: 50px; width: 50px;border-radius: 50%"
								src=${photoURL ? photoURL : "cid:usericon.com"}
								alt="user-icon"
							/>
						</div>
					</td>
				</tr>
			</table>
			<table
				role="presentation"
				style="align-items: center; margin: 0 auto; height: 16px"
			>
				<tr>
					<td>
						<h2 style="margin: 8px; opacity: 0.8">${
              displayName ? displayName : context.auth.token.email
            }</h2>
					</td>
				</tr>
			</table>

			<table role="presentation" style="align-items: center; margin: 0 auto">
				<tr>
					<td style="align-items: center; margin: 0 auto; opacity: 0.8">
						<p style="margin: 8px">has invited you to join DheraGram.</p>
					</td>
				</tr>
			</table>
			<table role="presentation" style="align-items: center; margin: 16px auto">
				<tr>
					<td style="align-items: center; margin: 0 auto">
						<a
							href="https://dhera-gram.web.app/signup"
							style="
								display: inline-block;
								padding: 15px 24px;
								cursor: pointer;
								background-color: #1a508b;
								color: #fff;
								border: none;
								text-decoration: none;
								font-weight: 300;
								border-radius: 5px;
							"
							>Check it out</a
						>
					</td>
				</tr>
			</table>
			<table>
				<tr>
					<td>
						<p
							style="
								margin: 0.5rem 1.5rem;
								text-align: center;
								opacity: 0.8;
								color: grey;
							"
						>
							DheraGram is a chat application created as a side project with ReactJS and Firebase. It consists of 
							a general group chat feature for all users, as well as a private chat option.
							I’d love to hear what you think of project.
						</p>
					</td>
				</tr>
			</table>
			<table style="margin: 0 auto">
				<tr>
					<td>
						<p
							style="
								margin: 0.5rem 1.5rem;
								text-align: center;
								opacity: 0.8;
								font-size: 0.9rem;
							"
						>
							Cheers,
						</p>
						<p
							style="
								margin: 0.5rem 1.5rem;
								text-align: center;
								opacity: 0.8;
								font-size: 0.9rem;
							"
						>
							Dera.
						</p>
					</td>
				</tr>
			</table>
		</div>
	</div>`,
    attachments: [
      {
        filename: "logo_true.jpeg",
        path: path.join(__dirname, "./images/logo_true.jpeg"),
        cid: "logo@dhera.com",
      },
      {
        filename: "usericon.png",
        path: path.join(__dirname, "./images/usericon.png"),
        cid: "usericon.com",
      },
    ],
  };

  return transporter.sendMail(mailOptions);
});
