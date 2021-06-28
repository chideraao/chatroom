import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../context/ChatsContext";
import { auth, db } from "../services/firebase";

function ChatRoom() {
	const [messages, setMessages] = useState([]);
	const [user, setUser] = useState(auth().currentUser);
	const [content, setContent] = useState("");
	const [readError, setReadError] = useState(null);
	const [writeError, setWriteError] = useState(null);
	const [chats, setChats] = useContext(ChatContext);

	const dummyDiv = useRef();

	/** handler for sending messages, updating db */
	const sendMessage = async (e) => {
		e.preventDefault();
		setContent("");
		setWriteError(null);

		/**regex to prevent sending whitespace */
		try {
			await db.ref("chats").push({
				content,
				timestamp: Date.now(),
				uid: user.uid,
			});
		} catch (err) {
			setWriteError(err.message);
		}
		dummyDiv.current.scrollIntoView({ behaviour: "smooth" });
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
				db.ref("chats")
					.limitToLast(70)
					.on("value", (snapshot) => {
						let message = [];
						snapshot.forEach((snap) => {
							message.push(snap.val());
						});
						setMessages(message);
					});
			} catch (err) {
				setReadError(err.message);
			}
		}
		getSnapshot();
	}, []);

	return (
		<div>
			<div className="chats">
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
			<form onSubmit={sendMessage} autoComplete="off">
				<input
					onChange={handleChange}
					value={content}
					placeholder="Type a message"
				></input>
				{writeError ? <p>{writeError}</p> : null}
				<button type="submit">Send</button>
			</form>
			<div>
				ChatRoom Logged in as: <strong>{user.email}</strong>
				<button onClick={handleSignOut}>Sign out</button>
			</div>
		</div>
	);
}

export default ChatRoom;
