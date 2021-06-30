import React, { createContext, useState } from "react";

export const ChatContext = createContext();
export const ScreenContext = createContext();

export const ChatsProvider = (props) => {
	const [chat, setChat] = useState(null);
	const [screen, setScreen] = useState(null);

	return (
		<ChatContext.Provider value={[chat, setChat]}>
			<ScreenContext.Provider value={[screen, setScreen]}>
				{props.children}
			</ScreenContext.Provider>
		</ChatContext.Provider>
	);
};
