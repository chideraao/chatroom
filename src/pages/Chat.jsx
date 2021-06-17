import React, { useEffect, useRef, useState } from "react";
import firebase from "firebase";
import { auth, store } from "../services/firebase";

function Chat() {
	const [messages, setMessages] = useState([]);
	const [user, setUser] = useState(auth().currentUser);
	const [input, setInput] = useState({ content: "", email: "" });
	const [readError, setReadError] = useState(null);
	const [writeError, setWriteError] = useState(null);
	const [searchError, setSearchError] = useState(null);
	const [chats, setChats] = useState(null);

	const { content, email } = input;

	const dummyDiv = useRef();

	/** handler for sending messages, updating db */
	const sendMessage = async (e) => {
		e.preventDefault();
		setWriteError(null);

		try {
			await store.collection(`${user.uid}`).doc("chats").collection(chats).add({
				content: content.trim(),
				timestamp: Date.now(),
				uid: user.uid,
			});
			setInput((prevState) => ({ ...prevState, content: "" }));
		} catch (err) {
			setWriteError(err.message);
			dummyDiv.current.scrollIntoView({ behaviour: "smooth" });
		}

		try {
			await store.collection(chats).doc("chats").collection(`${user.uid}`).add({
				content: content.trim(),
				timestamp: Date.now(),
				uid: user.uid,
			});
		} catch (err) {
			setWriteError(err.message);
		}
	};

	const handleSignOut = () => {
		auth().signOut();
	};

	/** handle form change and trim start to ensure no whitespace can be written to db */
	const handleChange = (e) => {
		setInput((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value.trimStart(),
		}));
	};

	const createNewChat = (e) => {
		let trimmedEmail = email.trim();
		e.preventDefault();

		store
			.collection("users")
			.where("email", "==", trimmedEmail)
			.get()
			.then((docs) => {
				if (docs.size > 0) {
					docs.forEach((doc) => {
						setChats(doc.data().uid);
					});
					setInput((prevState) => ({ ...prevState, content: "" }));
				} else {
					setSearchError(`User ${trimmedEmail} does not yet exist.? `);
				}
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	const emailInvite = () => {
		const inviteUser = firebase.functions().httpsCallable("inviteUser");
		inviteUser({
			email: email,
		});
		setInput((prevState) => ({ ...prevState, content: "" }));
	};

	useEffect(() => {
		setReadError(null);

		/** load existing messages in doc on page load. setting a limit to it */
		async function getSnapshot() {
			try {
				store
					.collection(`${user.uid}`)
					.doc("chats")
					.collection(chats)
					.orderBy("timestamp")
					.limit(60)
					.onSnapshot((docs) => {
						let message = [];
						docs.forEach((doc) => {
							message.push(doc.data());
						});
						setMessages(message);
					});
			} catch (err) {
				console.log(err.message);
			}
		}
		getSnapshot();
	}, [user, chats]);

	return (
		<div>
			<div className="chats">
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
					{searchError ? (
						<div>
							<p className="search-error">
								{searchError}{" "}
								<button onClick={emailInvite}>Invite via email</button>
							</p>
							<div className="email-invite flex">
								<button onClick={emailInvite}>Yes</button>
								<button>No</button>
							</div>
						</div>
					) : null}
				</form>

				{messages.map((text) => {
					/** check to see if message bubble was sent or received */
					let messageClass = text.uid === user.uid ? "sent" : "received";
					return (
						<p key={text.timestamp} className={messageClass}>
							{text.content}
						</p>
					);
				})}
				<div ref={dummyDiv}></div>
			</div>
			<form onSubmit={sendMessage}>
				<input
					onChange={handleChange}
					value={content}
					name="content"
					placeholder="Type a message"
				/>
				{writeError ? <p>{writeError}</p> : null}
				<button type="submit">Send</button>
			</form>
			<div>
				Chat Logged in as: <strong>{user.email}</strong>
				<button onClick={handleSignOut}>Sign out</button>
			</div>
		</div>
	);
}

export default Chat;
