import React, { createContext, useState } from "react";

export const ProfileCardContext = createContext();
export const ModalContext = createContext();
export const UsersContext = createContext();
export const ProviderContext = createContext();

export const ContactsProvider = (props) => {
	const [profileOpen, setProfileOpen] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [allUsers, setAllUsers] = useState([]);
	const [providerData, setProviderData] = useState(null);

	return (
		<ProfileCardContext.Provider value={[profileOpen, setProfileOpen]}>
			<ProviderContext.Provider value={[providerData, setProviderData]}>
				<UsersContext.Provider value={[allUsers, setAllUsers]}>
					<ModalContext.Provider value={[modalOpen, setModalOpen]}>
						{props.children}
					</ModalContext.Provider>
				</UsersContext.Provider>
			</ProviderContext.Provider>
		</ProfileCardContext.Provider>
	);
};
