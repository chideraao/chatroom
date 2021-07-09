import React, { createContext, useState } from "react";

export const ChatroomContentContext = createContext();
export const ChatroomEmojiContext = createContext();

export const ChatRoomProvider = (props) => {
	const [content, setContent] = useState("");

	return (
		<ChatroomContentContext.Provider value={[content, setContent]}>
			{props.children}
		</ChatroomContentContext.Provider>
	);
};
