import React, { createContext, useState } from "react";

export const ChatContext = createContext();
export const ScreenContext = createContext();
export const ContentContext = createContext();

export const ChatsProvider = (props) => {
	const [chat, setChat] = useState(null);
	const [screen, setScreen] = useState(null);
	const [content, setContent] = useState("");

	return (
		<ChatContext.Provider value={[chat, setChat]}>
			<ContentContext.Provider value={[content, setContent]}>
				<ScreenContext.Provider value={[screen, setScreen]}>
					{props.children}
				</ScreenContext.Provider>
			</ContentContext.Provider>
		</ChatContext.Provider>
	);
};
