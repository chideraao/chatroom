import React from "react";
import GroupIcon from "../assets/logo/group_icon.svg";

function NullScreen() {
	return (
		<div className="null-screen">
			<div className="logo">
				<img src={GroupIcon} alt="group avatar" />
			</div>
			<div className="showcase">
				<h2>Welcome to DheraGram</h2>
				<p>&copy; 2021 Made with &#x2764;&#xfe0f; &nbsp;by Okeke Chidera </p>
			</div>
		</div>
	);
}

export default NullScreen;
