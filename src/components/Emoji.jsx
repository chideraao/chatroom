import React, { useState } from "react";
import MaterialIcon from "material-icons-react";
import emojis from "../assets/emojiList.json";

function Emoji() {
	const [searchInput, setSearchInput] = useState("");

	let smileys = emojis.filter((emoji) => {
		return emoji.category.includes("Smileys & Emotion");
	});
	let flags = emojis.filter((emoji) => {
		return emoji.category === "Flags";
	});
	let animals = emojis.filter((emoji) => {
		return emoji.category === "Animals & Nature";
	});
	let food = emojis.filter((emoji) => {
		return emoji.category === "Food & Drink";
	});

	const handleChange = (e) => {
		setSearchInput(e.target.value);
	};

	const filteredEmojis = !searchInput
		? emojis
		: emojis.filter((emoji) => {
				return (
					emoji.description.toLowerCase().includes(searchInput.toLowerCase()) ||
					emoji.tags.toLowerCase().includes(searchInput.toLowerCase()) ||
					emoji.aliases.toLowerCase().includes(searchInput.toLowerCase())
				);
		  });

	return (
		<div className="card">
			<MaterialIcon icon="alarm_on" size="large" />
			<input
				type="text"
				onChange={handleChange}
				className="searchbox"
				id="emojisearch"
				value={searchInput}
				name="emojis"
				placeholder="Search"
			/>
			{searchInput ? (
				<div className="flex">
					{filteredEmojis.map((emoji) => {
						return <p>{emoji.emoji}</p>;
					})}{" "}
				</div>
			) : (
				<>
					<div className="smileys">
						Smileys
						<div className="flex">
							{smileys.map((emoji) => {
								return <p className="">{emoji.emoji}</p>;
							})}
						</div>
					</div>
					<div className="flags">
						Flags
						<div className="flex">
							{" "}
							{flags.map((emoji) => {
								return <p className="">{emoji.emoji}</p>;
							})}
						</div>
					</div>
					<div className="animals">
						Animals
						<div className="flex">
							{animals.map((emoji) => {
								return <p className="">{emoji.emoji}</p>;
							})}
						</div>
					</div>
					<div className="food">
						Food
						<div className="flex">
							{food.map((emoji) => {
								return <p className="">{emoji.emoji}</p>;
							})}
						</div>
					</div>{" "}
				</>
			)}
		</div>
	);
}

export default Emoji;
