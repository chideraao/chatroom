import React, { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";

function ChatRoom() {
	const [chats, setChats] = useState([]);
	const [user, setUser] = useState(auth().currentUser);
	const [content, setContent] = useState("");
	const [readError, setReadError] = useState(null);
	const [writeError, setWriteError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setContent("");
		setWriteError(null);
		if (content !== "") {
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
	};

	const handleChange = (e) => {
		setContent(e.target.value);
	};

	useEffect(() => {
		setReadError(null);
		async function getSnapshot() {
			try {
				db.ref("chats").on("value", (snapshot) => {
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

	return (
		<div>
			<div className="chats">
				{chats.map((chat) => {
					return <p key={chat.timestamp}>{chat.content}</p>;
				})}
			</div>
			<form onSubmit={handleSubmit}>
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
			</div>
		</div>
	);
}

export default ChatRoom;
