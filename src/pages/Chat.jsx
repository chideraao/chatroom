import React, { useEffect, useRef, useState } from "react";
import firebase from "firebase";
import { auth, store } from "../services/firebase";

function Chat() {
	const [chats, setChats] = useState([]);
	const [user, setUser] = useState(auth().currentUser);
	const [input, setInput] = useState({ content: "", email: "" });
	const [readError, setReadError] = useState(null);
	const [writeError, setWriteError] = useState(null);
	// const [other, setother] = useState(null)

	const { content, email } = input;

	const dummyDiv = useRef();

	/** handler for sending messages, updating db */
	const sendMessage = async (e) => {
		e.preventDefault();
		setWriteError(null);

		try {
			await store
				.collection(`${user.uid}`)
				.doc("chats")
				.collection("user")
				.add({
					content,
					timestamp: Date.now(),
					uid: user.uid,
				});
			setInput((prevState) => ({ ...prevState, content: "" }));
		} catch (err) {
			setWriteError(err.message);

			dummyDiv.current.scrollIntoView({ behaviour: "smooth" });
		}
	};

	const handleSignOut = () => {
		auth().signOut();
	};

	/** handle form change and trim start to ensure no whitespace can be written to db */
	const handleChange = (e) => {
		setInput((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const createNewChat = (e) => {
		console.log("adding", email);
		e.preventDefault();
		const newChat = firebase.functions().httpsCallable("newChat");

		newChat({
			email,
		})
			.then(() => {
				setInput((prevState) => ({ ...prevState, email: "" }));
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	useEffect(() => {
		setReadError(null);

		/** load existing messages in doc on page load. setting a limit to it */
		async function getSnapshot() {
			try {
				store
					.collection(`${user.uid}`)
					.doc("chats")
					.collection("user")
					.orderBy("timestamp")
					.limit(60)
					.onSnapshot((docs) => {
						let chat = [];
						docs.forEach((doc) => {
							chat.push(doc.data());
						});
						setChats(chat);
					});
			} catch (err) {
				setReadError(err.message);
			}
		}
		getSnapshot();
	}, [user]);

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
				</form>

				{chats.map((chat) => {
					/** check to see if message bubble was sent or received */
					let messageClass = chat.uid === user.uid ? "sent" : "received";
					return (
						<p key={chat.timestamp} className={messageClass}>
							{chat.content}
						</p>
					);
				})}
				<div ref={dummyDiv}></div>
			</div>
			<form onSubmit={sendMessage}>
				<input
					type="text"
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
