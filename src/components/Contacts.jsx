import React, { useContext, useEffect, useRef, useState } from "react";
import firebase from "firebase";
import { auth, store, db } from "../services/firebase";
import { ChatContext, ScreenContext } from "../context/ChatsContext";
import ChatList from "./ChatList";

function Contacts() {
	const [user, setUser] = useState(auth().currentUser);
	const [searchError, setSearchError] = useState(null);
	const [chat, setChat] = useContext(ChatContext);
	const [activeChats, setActiveChats] = useState([]);
	const [screen, setScreen] = useContext(ScreenContext);
	const [input, setInput] = useState({ content: "", email: "" });

	const { content, email } = input;
	const searchRef = useRef();

	useEffect(() => {
		/** initialise and call cloud function to list chats */
		const listActiveChats = firebase
			.functions()
			.httpsCallable("listActiveChats");

		listActiveChats({ docPath: `${user.email}/chats` })
			.then((res) => {
				let collections = res.data.collections;
				setActiveChats(collections);
			})
			.catch((err) => {
				alert(err.message);
			});
	}, [user, chat]);

	/** https callable function to send emails  */
	const emailInvite = () => {
		let contentReset = () => {
			searchRef.current.innerHTML = "";
		};
		const inviteUser = firebase.functions().httpsCallable("inviteUser");

		inviteUser({
			email: email.trim().toLowerCase(),
		})
			.then((res) => {
				console.log(res.data);
				setInput((prevState) => ({ ...prevState, email: "" }));
				alert("Email invitation sent successfully");
				setSearchError(contentReset);
			})
			.catch((err) => {
				alert(err);
			});
	};

	const createNewChat = (e) => {
		//email regex
		let validateEmail = (email) => {
			let regex = /\S+@\S+\.\S+/;
			return regex.test(email);
		};

		let errorMessage = (userEmail) => {
			searchRef.current.innerHTML = `User ${userEmail} does not yet exist. <button id='mail-btn'>Invite via email?</button> `;
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
							setChat(doc.data().email);
							setInput((prevState) => ({ ...prevState, email: "" }));
						});
					} else {
						setSearchError(errorMessage(trimmedEmail));
					}
				})
				.catch((err) => {
					alert(err.message);
				});
		}
	};

	const handleClick = () => {
		setScreen("chatroom");
	};

	/** handle form change and trim start to ensure no whitespace can be written to db */
	const handleChange = (e) => {
		setInput((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value.trimStart(),
		}));
	};

	return (
		<div className="contacts">
			<div className="contact-header">
				<h2>Chats</h2>
			</div>
			<form onSubmit={createNewChat}>
				<input
					type="text"
					onChange={handleChange}
					className="searchbox"
					id="newChat"
					value={email}
					name="email"
					placeholder="Search Dheragram"
				/>
				<div>
					<p id="search-error" ref={searchRef}>
						{searchError ? `${searchError}` : ""}
					</p>
				</div>
			</form>
			<div className="message-list">
				<div className="group-chat" onClick={handleClick}>
					<div className="img"></div>
					megachat
				</div>
				<div className="">
					{activeChats.map((chat) => {
						return <ChatList key={chat} id={chat} chats={chat} />;
					})}
				</div>
			</div>
		</div>
	);
}

export default Contacts;
