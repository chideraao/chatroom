import React, { useContext } from "react";
import {
	ChatContext,
	ContentContext,
	ScreenContext,
} from "../context/ChatsContext";
import UserIcon from "../assets/logo/usericon.png";
import { ModalContext } from "../context/ContactsContext";
import { db } from "../services/firebase";

function ChatList({ id, email, photoURL, msg, timestamp }) {
	const [chat, setChat] = useContext(ChatContext);
	const [screen, setScreen] = useContext(ScreenContext);
	const [content, setContent] = useContext(ContentContext);
	const [modalOpen, setModalOpen] = useContext(ModalContext);

	const handleClick = () => {
		if (chat !== id) {
			setContent("");
		}
		setChat(id);
		setScreen("chat");
		setModalOpen(false);
	};

	let timeSent = new Date(timestamp);

	let minutes = timeSent.getMinutes();
	let hours = timeSent.getHours();

	let active = chat === id ? "onChat" : "";

	return (
		<div onClick={handleClick} className={`${active} grid`}>
			<div className="chat-img">
				<img src={photoURL || UserIcon} alt={`${email} img`} />
			</div>
			<div className="chat-email flex">
				<div className="">
					<p>{email}</p>
					<p>{msg}</p>
				</div>

				{timestamp ? (
					<p id="timestamp">{`${hours}:${
						minutes < 10 ? `0${minutes}` : minutes
					}`}</p>
				) : (
					""
				)}
			</div>
		</div>
	);
}

export default ChatList;
