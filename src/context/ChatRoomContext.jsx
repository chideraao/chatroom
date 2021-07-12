import React, { createContext, useState } from "react";

export const ChatroomContentContext = createContext();
export const PhotoURLContext = createContext();

export const ChatRoomProvider = (props) => {
	const [content, setContent] = useState("");
	const [providerURL, setProviderURL] = useState("");

	return (
		<ChatroomContentContext.Provider value={[content, setContent]}>
			<PhotoURLContext.Provider value={[providerURL, setProviderURL]}>
				{props.children}
			</PhotoURLContext.Provider>
		</ChatroomContentContext.Provider>
	);
};
