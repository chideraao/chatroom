import React, { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatsProvider = (props) => {
	const [chat, setChat] = useState(null);

	return (
		<ChatContext.Provider value={[chat, setChat]}>
			{props.children}
		</ChatContext.Provider>
	);
};
