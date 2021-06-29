import React from "react";
import Chat from "../components/Chat";
import ChatRoom from "../components/ChatRoom";
import Contacts from "../components/Contacts";

function Home() {
	return (
		<div className="grid">
			<Contacts />
			<Chat />
			{/* <ChatRoom /> */}
		</div>
	);
}

export default Home;
