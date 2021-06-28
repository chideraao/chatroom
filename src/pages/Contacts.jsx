import React, { useContext, useEffect, useState } from "react";
import firebase from "firebase";
import { auth, store } from "../services/firebase";
import { ChatContext } from "../context/ChatsContext";

function Contacts() {
	const [user, setUser] = useState(auth().currentUser);
	const [searchError, setSearchError] = useState(null);
	const [chats, setChats] = useContext(ChatContext);
	const [input, setInput] = useState({ content: "", email: "" });

	const { content, email } = input;

	useEffect(() => {
		user.providerData.forEach((profile) => {
			console.log("sign-in provider", profile.providerId);
			console.log("uid", profile.uid);
			console.log(" displayname", profile.displayName);
			console.log("email", profile.email);
			console.log("photourl", profile.photoURL);
		});
	}, [user]);

	/** handle form change and trim start to ensure no whitespace can be written to db */
	const handleChange = (e) => {
		setInput((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value.trimStart(),
		}));
	};

	/** https callable function to send emails  */
	const emailInvite = () => {
		const inviteUser = firebase.functions().httpsCallable("inviteUser");

		inviteUser({
			email: email.trim().toLowerCase(),
		})
			.then((res) => {
				console.log(res.data);
				//create popup
				setInput((prevState) => ({ ...prevState, email: "" }));
				setSearchError("");
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const createNewChat = (e) => {
		//email regex
		let validateEmail = (email) => {
			var re = /\S+@\S+\.\S+/;
			return re.test(email);
		};

		/**fix the goddamned error message bug niggggggaaax */
		let errorMessage = (userEmail) => {
			document.getElementById(
				"search-error"
			).innerHTML = `User ${userEmail} does not yet exist. <button id='mail-btn'>Invite via email?</button> `;
			document
				.getElementById("mail-btn")
				.addEventListener("click", emailInvite, true);
		};

		let trimmedEmail = email.trim().toLowerCase();
		e.preventDefault();
		setSearchError(null);

		if (trimmedEmail === "") {
			setSearchError("User email can not be empty");
		} else if (!validateEmail(trimmedEmail)) {
			setSearchError("Please enter a valid email.");
		} else {
			store
				.collection("users")
				.where("email", "==", trimmedEmail)
				.get()
				.then((docs) => {
					if (docs.size > 0) {
						docs.forEach((doc) => {
							setChats(doc.data().uid);
							setInput((prevState) => ({ ...prevState, email: "" }));
						});
					} else {
						setSearchError(errorMessage(trimmedEmail));
					}
				})
				.catch((err) => {
					console.log(err.message);
				});
		}
	};

	return (
		<div className="contacts">
			<form onSubmit={createNewChat}>
				<input
					type="text"
					onChange={handleChange}
					id="newChat"
					value={email}
					name="email"
					placeholder="Enter user email"
				/>
				<button type="submit">New Chat</button>
				<div>
					<p id="search-error">{searchError ? `${searchError}` : ""}</p>
				</div>
			</form>
		</div>
	);
}

export default Contacts;
