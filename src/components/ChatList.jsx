import React, { useContext, useState } from "react";
import { ChatContext } from "../context/ChatsContext";
import firebase from "firebase";
import { auth, store, db } from "../services/firebase";

function ChatList({ id, chats }) {
	const [chat, setChat] = useContext(ChatContext);
	const [user, setUser] = useState(auth().currentUser);

	const handleClick = () => {
		setChat(id);
	};
	return <div onClick={handleClick}>{chats}</div>;
}

export default ChatList;
