import React from "react";
import emojis from "../assets/emojiList.json";

function Emoji() {
	// let flags = ["Flags"];
	// let neeww = Object.keys(emojis)
	// 	.filter((key) => flags.includes(key))
	// 	.reduce((obj, key) => {
	// 		obj[key] = emojis[key];
	// 		return obj;
	// 	}, {});

	// console.log(neeww);

	return (
		<div className="card">
			{emojis.map((emoji) => {
				return <p className="">{emoji.emoji}</p>;
			})}
		</div>
	);
}

export default Emoji;
