import React, { useContext, useState } from "react";
import { PhotoURLContext } from "../context/ChatRoomContext";
import UserIcon from "../assets/logo/usericon.png";
import { ReactComponent as Logout } from "../assets/logo/logout_black_24dp.svg";

import { auth } from "../services/firebase";

function ProfileCard() {
	const [user, setUser] = useState(auth().currentUser);
	const [providerURL, setProviderURL] = useContext(PhotoURLContext);

	const handleSignOut = () => {
		auth().signOut();
	};

	return (
		<div className="card profile-card">
			<div className="profile-head flex">
				<img src={providerURL || UserIcon} alt="user avatar" />
				<p>{user.email}</p>
			</div>
			<div className="signout flex" onClick={handleSignOut}>
				<Logout />
				<p>Signout</p>
			</div>
		</div>
	);
}

export default ProfileCard;
