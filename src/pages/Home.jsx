import React from "react";
import Chat from "./Chat";
import Contacts from "./Contacts";

function Home() {
	return (
		<div className="grid">
			<Contacts />
			<Chat />
		</div>
	);
}

export default Home;
