import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatContext, ContentContext } from "../context/ChatsContext";
import { auth, store } from "../services/firebase";
import styles from "../styles/chats.module.css";
import Emoji from "./Emoji";
import { ReactComponent as Emoticon } from "../assets/logo/insert_emoticon_black_24dp.svg";

function Chat() {
	const [messages, setMessages] = useState([]);
	const [user, setUser] = useState(auth().currentUser);
	const [content, setContent] = useContext(ContentContext);
	const [readError, setReadError] = useState(null);
	const [writeError, setWriteError] = useState(null);
	const [chat, setChat] = useContext(ChatContext);
	const [emojiOpen, setEmojiOpen] = useState(false);

	const dummy = useRef();
	let chatInput = useRef();

	/** handler for sending messages, updating db */
	const sendMessage = async (e) => {
		e.preventDefault();
		setWriteError(null);

		if (content !== "") {
			try {
				await store
					.collection(`${user.email}`)
					.doc("chats")
					.collection(chat)
					.add({
						content: content.trim(),
						timestamp: Date.now(),
						uid: user.uid,
					});
				setContent("");
				dummy.current.scrollIntoView({ behavior: "smooth" });
			} catch (err) {
				setWriteError(err.message);
			}
		}

		if (chat !== user.email && content !== "") {
			try {
				await store
					.collection(chat)
					.doc("chats")
					.collection(`${user.email}`)
					.add({
						content: content.trim(),
						timestamp: Date.now(),
						uid: user.uid,
					});
				dummy.current.scrollIntoView({ behavior: "smooth" });
			} catch (err) {
				setWriteError(err.message);
			}
		}
	};

	const handleSignOut = () => {
		auth().signOut();
	};

	const xxx = (mee) => {
		let regex = /[ A-Za-z0-9\\!_$%^*()@={}"';:?.,><|./#&+-]/;
		return regex.test(mee);
	};

	/** handle form change and trim start to ensure no whitespace can be written to db */
	const handleChange = (e) => {
		setContent(e.target.value.trimStart());
	};

	const handleClick = () => {
		setEmojiOpen(true);
	};

	useEffect(() => {
		chatInput.focus();
		setReadError(null);

		/**function to check uid of the next message in collection and add a style accordingly */
		function nextCheck(arr) {
			for (var i = 0; i < arr.length - 1; i++) {
				let current = arr[i];
				let next = arr[i + 1];

				if (current.uid === next.uid) {
					current.style = `${current.style} not-last-msg`;
				} else {
					current.style = "";
				}
			}
		}

		/** load existing messages in doc on page load. setting a limit to it */
		async function getSnapshot() {
			try {
				store
					.collection(`${user.email}`)
					.doc("chats")
					.collection(chat)
					.orderBy("timestamp")
					.onSnapshot((docs) => {
						let message = [];
						docs.forEach((doc) => {
							message.push(doc.data());
						});
						nextCheck(message);
						setMessages(message);
					});
			} catch (err) {
				alert(err.message);
			}
		}

		getSnapshot();
	}, [user, chat]);

	return (
		<div className={styles.chat}>
			<div className={styles.body}>
				<h2>DheraGram with {chat}</h2>
				<div className={styles.message}>
					{messages.map((text) => {
						/** check to see if message bubble was sent or received */
						let messageClass =
							text.uid === user.uid ? styles.sent : styles.received;
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

				<span ref={dummy}></span>
			</div>
			<div className="input-container flex">
				<form
					className="message-send"
					onSubmit={sendMessage}
					autoComplete="off"
				>
					<input
						onChange={handleChange}
						value={content}
						name="content"
						placeholder="DheraGram"
						autoFocus
						ref={(input) => (chatInput = input)}
					/>
					{writeError ? <p>{writeError}</p> : null}
					<button type="submit">Send</button>
				</form>
				{emojiOpen ? <Emoji /> : ""}
				<Emoticon onClick={handleClick} />
			</div>
			<div>
				Chat Logged in as: <strong>{user.email}</strong>
				<button onClick={handleSignOut}>Sign out</button>
			</div>
		</div>
	);
}

export default Chat;
