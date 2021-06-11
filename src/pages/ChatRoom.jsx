import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../services/firebase";

function ChatRoom() {
	const [chats, setChats] = useState([]);
	const [user, setUser] = useState(auth().currentUser);
	const [content, setContent] = useState("");
	const [readError, setReadError] = useState(null);
	const [writeError, setWriteError] = useState(null);

	const dummyDiv = useRef();

	/** handler for sending messages, updating db */
	const sendMessage = async (e) => {
		e.preventDefault();
		setContent("");
		setWriteError(null);

		/**regex to prevent sending whitespace */
		let invalid = /\s/;
		if (content !== invalid) {
			try {
				await db.ref("chats").push({
					content,
					timestamp: Date.now(),
					uid: user.uid,
				});
			} catch (err) {
				setWriteError(err.message);
			}
		}
		dummyDiv.current.scrollIntoView({ behaviour: "smooth" });
	};

	const handleSignOut = () => {
		auth().signOut();
	};

	const handleChange = (e) => {
		setContent(e.target.value);
	};

	useEffect(() => {
		setReadError(null);

		/** get existing messages in doc on page load. setting a limit to it */
		async function getSnapshot() {
			try {
				db.ref("chats")
					.limitToLast(30)
					.on("value", (snapshot) => {
						let chat = [];
						snapshot.forEach((snap) => {
							chat.push(snap.val());
						});
						setChats(chat);
					});
			} catch (err) {
				setReadError(err.message);
			}
		}
		getSnapshot();
	}, []);

	/** check to see if message was sent or received */
	const messageClass = chats.uid === user.uid ? "sent" : "received";

	return (
		<div>
			<div className="chats">
				{chats.map((chat) => {
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
				Logged in as: <strong>{user.email}</strong>
				<button onClick={handleSignOut}>Sign out</button>
			</div>
		</div>
	);
}

export default ChatRoom;