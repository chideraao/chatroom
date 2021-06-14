import React from "react";
import Chat from "./Chat";
import ChatRoom from "./ChatRoom";
import Contacts from "./Contacts";

function Home() {
	return (
		<div className="grid">
			{/* <Contacts /> */}
			<Chat />
			<ChatRoom />
		</div>
	);
}

export default Home;
