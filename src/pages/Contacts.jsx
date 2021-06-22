import React, { useState } from "react";
import firebase from "firebase";
import { auth, store } from "../services/firebase";
import { ChatContext } from "../context/ChatsContext";

function Contacts() {
	const [searchError, setSearchError] = useState(null);
	const [chats, setChats] = useState(ChatContext);
	const [input, setInput] = useState({ content: "", email: "" });

	const { content, email } = input;

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
			email: email.trim(),
		})
			.then((res) => {
				console.log(res.data);
				//create popup
				setInput((prevState) => ({ ...prevState, email: "" }));
				setSearchError(null);
			})
			.catch((err) => {
				console.log(err);
			});

		setInput((prevState) => ({ ...prevState, content: "" }));
	};

	const createNewChat = (e) => {
		let trimmedEmail = email.trim();
		e.preventDefault();
		setSearchError(null);

		//email regex
		let validateEmail = (email) => {
			var re = /\S+@\S+\.\S+/;
			return re.test(email);
		};

		let errorMessage = (userEmail) => {
			document.getElementById(
				"search-error"
			).innerHTML = `User ${userEmail} does not yet exist. <button id='mail-btn'>Invite via email?</button> `;
			document
				.getElementById("mail-btn")
				.addEventListener("click", emailInvite, true);
		};

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
					<p id="search-error">{searchError ? searchError : ""}</p>
				</div>
			</form>
		</div>
	);
}

export default Contacts;
