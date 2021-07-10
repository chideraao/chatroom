import React, { useEffect, useState } from "react";
import { auth } from "../services/firebase";

function ProfileCard() {
	const [user, setUser] = useState(auth().currentUser);

	const handleSignOut = () => {
		auth().signOut();
	};

	let photoURL;

	useEffect(() => {
		user.providerData.forEach((profile) => {
			photoURL = profile.photoURL;
		});
	}, []);

	return (
		<div className="card">
			<div className="profile-head flex">
				<img src={photoURL} alt="" />
				<p>{user.email}</p>
			</div>
			<div className="" onClick={handleSignOut}>
				<p>Signout</p>
			</div>
		</div>
	);
}

export default ProfileCard;
