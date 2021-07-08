import React, { useContext, useState } from "react";
import { ChatContext, ScreenContext } from "../context/ChatsContext";
import firebase from "firebase";
import { auth, store, db } from "../services/firebase";

function ChatList({ id, chats }) {
	const [chat, setChat] = useContext(ChatContext);
	const [user, setUser] = useState(auth().currentUser);
	const [screen, setScreen] = useContext(ScreenContext);

	// user.providerData.forEach((profile) => {
	// 	console.log("sign-in provider", profile.providerId);
	// 	console.log("uid", profile.uid);
	// 	console.log(" displayname", profile.displayName);
	// 	console.log("email", profile.email);
	// 	console.log("photourl", profile.photoURL);
	// });

	const handleClick = () => {
		setChat(id);
		setScreen("chat");
	};

	return (
		<div onClick={handleClick}>
			<div className="img"></div>
			<p>{chats}</p>
		</div>
	);
}

export default ChatList;
