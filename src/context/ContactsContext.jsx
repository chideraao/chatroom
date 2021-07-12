import React, { createContext, useState } from "react";

export const ProfileCardContext = createContext();
export const ModalContext = createContext();

export const ContactsProvider = (props) => {
	const [profileOpen, setProfileOpen] = useState(false);
	const [providerURL, setProviderURL] = useState("");

	return (
		<ProfileCardContext.Provider value={[profileOpen, setProfileOpen]}>
			<ModalContext.Provider value={[providerURL, setProviderURL]}>
				{props.children}
			</ModalContext.Provider>
		</ProfileCardContext.Provider>
	);
};
