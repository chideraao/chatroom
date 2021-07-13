import { React, useContext } from "react";
import Chat from "../components/Chat";
import ChatRoom from "../components/ChatRoom";
import Contacts from "../components/Contacts";
import NewCard from "../components/NewCard";
import { ScreenContext } from "../context/ChatsContext";
import { ModalContext } from "../context/ContactsContext";

function Home() {
	const [screen, setScreen] = useContext(ScreenContext);
	const [modalOpen, setModalOpen] = useContext(ModalContext);

	return (
		<div className="grid">
			<Contacts />
			{screen === "chatroom" ? <ChatRoom /> : <Chat />}
			{modalOpen ? <NewCard /> : ""}
		</div>
	);
}

export default Home;
