import React, { useEffect, useRef, useState } from "react";
import { auth, store } from "../services/firebase";

function Chat() {
	const [chats, setChats] = useState([]);
	const [user, setUser] = useState(auth().currentUser);
	const [content, setContent] = useState("");
	const [readError, setReadError] = useState(null);
	const [writeError, setWriteError] = useState(null);
	// const [other, setother] = useState(null)

	const dummyDiv = useRef();

	/** handler for sending messages, updating db */
	const sendMessage = async (e) => {
		e.preventDefault();
		setContent("");
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
		setContent(e.target.value.trimStart());
	};

	useEffect(() => {
		setReadError(null);

		/** get existing messages in doc on page load. setting a limit to it */
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
				{chats.map((chat) => {
					/** check to see if message bubble was sent or received */
					let messageClass = chats.uid === user.uid ? "sent" : "received";
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
					onChange={handleChange}
					value={content}
					placeholder="Type a message"
				></input>
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
