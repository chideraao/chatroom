import React, { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatsProvider = (props) => {
	const [chats, setChats] = useState(null);

	return (
		<ChatContext.Provider value={[chats, setChats]}>
			{props.children}
		</ChatContext.Provider>
	);
};
