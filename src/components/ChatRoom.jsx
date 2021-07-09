import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatContext, EmojiContext } from "../context/ChatsContext";
import { auth, db } from "../services/firebase";
import Emoji from "./Emoji";
import styles from "../styles/chatroom.module.css";
import { ReactComponent as Emoticon } from "../assets/logo/insert_emoticon_black_24dp.svg";
import { ChatroomContentContext } from "../context/ChatRoomContext";

function ChatRoom() {
	const [messages, setMessages] = useState([]);
	const [user, setUser] = useState(auth().currentUser);
	const [content, setContent] = useContext(ChatroomContentContext);
	const [readError, setReadError] = useState(null);
	const [writeError, setWriteError] = useState(null);
	const [chats, setChats] = useContext(ChatContext);
	const [emojiOpen, setEmojiOpen] = useContext(EmojiContext);
	const [inputClass, setInputClass] = useState("");

	const dummyDiv = useRef();
	let chatInput = useRef();

	/** handler for sending messages, updating db */
	const sendMessage = async (e) => {
		e.preventDefault();
		setWriteError(null);

		if (content !== "") {
			try {
				await db.ref("chats").push({
					content,
					timestamp: Date.now(),
					uid: user.uid,
				});
				setContent("");
				dummyDiv.current.scrollIntoView({ behaviour: "smooth" });
			} catch (err) {
				setWriteError(err.message);
			}
		}
	};

	const emojiCheck = (str) => {
		let regex = /[ A-Za-z0-9\\!_$%^*()@={}"';:?.,><|./#&+-]/;
		return regex.test(str);
	};

	const handleSignOut = () => {
		auth().signOut();
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

				if (!emojiCheck(next.content) || current.uid !== next.uid) {
					current.style = "";
				} else {
					current.style = `${styles.pasDernier}`;
				}
			}
		}

		if (content !== "" && !emojiCheck(content) && content.length <= 8) {
			setInputClass("emoji");
			chatInput.focus();
		} else {
			setInputClass("");
			chatInput.focus();
		}

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
						nextCheck(message);
						message.forEach((msg) => {
							if (!emojiCheck(msg.content) && msg.content.length <= 8) {
								msg.style = `${msg.style} ${styles.emoji}`;
							}
						});
						setMessages(message);
					});
			} catch (err) {
				setReadError(err.message);
			}
		}
		getSnapshot();
	}, [content]);

	return (
		<div>
			<div className={styles.chat}>
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
					<span ref={dummyDiv}></span>
				</div>
			</div>
			<div className="input-container flex">
				{emojiOpen ? <Emoji /> : ""}
				<Emoticon onClick={handleClick} />
				<form onSubmit={sendMessage} autoComplete="off">
					<input
						onChange={handleChange}
						value={content}
						name="content"
						placeholder="DheraGram"
						className={`${inputClass} ${styles.message_input}`}
						ref={(input) => (chatInput = input)}
					></input>
				</form>
			</div>
			{/* <div>
				ChatRoom Logged in as: <strong>{user.email}</strong>
				<button onClick={handleSignOut}>Sign out</button>
			</div> */}
		</div>
	);
}

export default ChatRoom;
