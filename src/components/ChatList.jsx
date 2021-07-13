import React, { useContext } from "react";
import {
	ChatContext,
	ContentContext,
	ScreenContext,
} from "../context/ChatsContext";
import UserIcon from "../assets/logo/usericon.png";
import { ModalContext } from "../context/ContactsContext";

function ChatList({ id, chats, photoURL }) {
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

	let active = chat === id ? "onChat" : "";

	return (
		<div onClick={handleClick} className={`${active} flex`}>
			<div className="chat-img">
				<img src={photoURL || UserIcon} alt="" />
			</div>
			<div className="chat-email">
				<p>{chats}</p>
			</div>
		</div>
	);
}

export default ChatList;
