import React, { useContext, useEffect, useState } from "react";
import {
	ChatContext,
	ContentContext,
	ScreenContext,
} from "../context/ChatsContext";
import { auth } from "../services/firebase";
import UserIcon from "../assets/logo/usericon.png";

function ChatList({ id, chats }) {
	const [chat, setChat] = useContext(ChatContext);
	const [user, setUser] = useState(auth().currentUser);
	const [screen, setScreen] = useContext(ScreenContext);
	const [content, setContent] = useContext(ContentContext);

	// user.providerData.forEach((profile) => {
	// 	console.log("sign-in provider", profile.providerId);
	// 	console.log("uid", profile.uid);
	// 	console.log(" displayname", profile.displayName);
	// 	console.log("email", profile.email);
	// 	console.log("photourl", profile.photoURL);
	// });

	const handleClick = () => {
		if (chat !== id) {
			setContent("");
		}
		setChat(id);
		setScreen("chat");
	};

	let active = chat === id ? "onChat" : "";

	return (
		<div onClick={handleClick} className={`${active} flex`}>
			<div className="chat-img">
				<img src={UserIcon} alt="" />
			</div>
			<div className="chat-email">
				<p>{chats}</p>
			</div>
		</div>
	);
}

export default ChatList;
