import { React, useContext } from "react";
import Chat from "../components/Chat";
import ChatRoom from "../components/ChatRoom";
import Contacts from "../components/Contacts";
import Emoji from "../components/Emoji";
import { ScreenContext } from "../context/ChatsContext";

function Home() {
	const [screen, setScreen] = useContext(ScreenContext);

	return (
		<div className="grid">
			{/* <Contacts /> */}
			{/* <Chat /> */}
			<Emoji />
			{/* <ChatRoom /> */}
		</div>
	);
}

export default Home;
