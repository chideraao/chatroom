import { React, useContext } from "react";
import Chat from "../components/Chat";
import ChatRoom from "../components/ChatRoom";
import Contacts from "../components/Contacts";
import NewCard from "../components/NewCard";
import NullScreen from "../components/NullScreen";
import { ChatContext, ScreenContext } from "../context/ChatsContext";
import { ModalContext } from "../context/ContactsContext";

function Home() {
	const [screen, setScreen] = useContext(ScreenContext);
	const [modalOpen, setModalOpen] = useContext(ModalContext);
	const [chat, setChat] = useContext(ChatContext);

	return (
		<div className="home grid">
			<Contacts />
			{screen === "chatroom" ? (
				<ChatRoom />
			) : chat === null ? (
				<NullScreen />
			) : (
				<Chat />
			)}
			{modalOpen ? <NewCard /> : ""}
		</div>
	);
}

export default Home;
