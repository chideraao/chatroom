import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../context/ChatsContext";
import { auth, store } from "../services/firebase";

function Chat() {
	const [messages, setMessages] = useState([]);
	const [user, setUser] = useState(auth().currentUser);
	const [content, setContent] = useState("");
	const [readError, setReadError] = useState(null);
	const [writeError, setWriteError] = useState(null);
	const [chats, setChats] = useContext(ChatContext);

	let arr = messages;

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
			setContent("");
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
		setContent(e.target.value.trimStart());
	};

	useEffect(() => {
		setReadError(null);

		function pairwise(arr, func) {
			for (var i = 0; i < arr.length - 1; i++) {
				func(arr[i], arr[i + 1]);
			}
		}

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
						pairwise(message, function (current, next) {
							if (current.uid === next.uid) {
								current.style = "innnit";
							} else {
								current.style = "";
							}
						});
						setMessages(message);
					});
			} catch (err) {
				console.log(err.message);
			}
		}

		console.log(messages);

		getSnapshot();
	}, [user, chats]);

	return (
		<div>
			<div className="chats">
				<div className="message">
					{messages.map((text) => {
						/** check to see if message bubble was sent or received */
						let messageClass = text.uid === user.uid ? "sent" : "received";
						return (
							<p
								key={text.timestamp}
								className={`${messageClass} ${text.style}`}
							>
								{text.content}
							</p>
						);
					})}
				</div>

				<div ref={dummyDiv}></div>
			</div>
			<form className="message-send" onSubmit={sendMessage} autoComplete="off">
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
