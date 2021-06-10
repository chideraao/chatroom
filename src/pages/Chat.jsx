import React, { useEffect, useState } from "react";
import { auth, store } from "../services/firebase";

function Chat() {
	const [chats, setChats] = useState([]);
	const [user, setUser] = useState(auth().currentUser);
	const [content, setContent] = useState("");
	const [readError, setReadError] = useState(null);
	const [writeError, setWriteError] = useState(null);
	// const [other, setother] = useState(null)

	const handleSubmit = async (e) => {
		e.preventDefault();
		setContent("");
		setWriteError(null);
		if (content !== "") {
			try {
				await store
					.collection(`${user.uid}`)
					.doc("chats")
					.collection("user")
					.add(
						{
							content,
							timestamp: Date.now(),
							uid: user.uid,
						},
						{ merge: "true" }
					);
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
				let chat = [];
				store
					.collection(`${user.uid}`)
					.doc("chats")
					.collection("user")
					.onSnapshot((docs) => {
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

export default Chat;
