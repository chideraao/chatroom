import React, { useEffect, useRef, useState } from "react";
import emojis from "../assets/emojiList.json";
import { ReactComponent as Emotion } from "../assets/logo/emoji_emotions_white_24dp.svg";
import { ReactComponent as Nature } from "../assets/logo/emoji_nature_white_24dp.svg";
import { ReactComponent as Food } from "../assets/logo/emoji_food_beverage_white_24dp.svg";
import { ReactComponent as Events } from "../assets/logo/emoji_events_white_24dp.svg";
import { ReactComponent as Objects } from "../assets/logo/emoji_objects_white_24dp.svg";
import { ReactComponent as Transportation } from "../assets/logo/emoji_transportation_white_24dp.svg";
import { ReactComponent as Symbols } from "../assets/logo/emoji_symbols_white_24dp.svg";
import { ReactComponent as Flags } from "../assets/logo/emoji_flags_white_24dp.svg";
import { ReactComponent as People } from "../assets/logo/emoji_people_white_24dp.svg";

function Emoji() {
	const [searchInput, setSearchInput] = useState("");
	const [className, setClassName] = useState("");
	const [links, setLinks] = useState(null);

	const iconRef = useRef();
	useEffect(() => {
		setLinks(iconRef.current.querySelectorAll("a"));
	}, []);

	console.log(iconRef);
	console.log(links);

	let smileys = emojis.filter((emoji) => {
		return (
			emoji.category.includes("Smileys & Emotion") ||
			emoji.category.includes("People & Body")
		);
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
	let objects = emojis.filter((emoji) => {
		return emoji.category === "Objects";
	});
	let symbols = emojis.filter((emoji) => {
		return emoji.category === "Symbols";
	});
	let travel = emojis.filter((emoji) => {
		return emoji.category === "Travel & Places";
	});
	let activities = emojis.filter((emoji) => {
		return emoji.category === "Activities";
	});

	const handleChange = (e) => {
		setSearchInput(e.target.value);
	};
	window.addEventListener("scroll", (event) => {
		console.log("scrolling");
		let fromTop = window.scrollY;
		links.forEach((link) => {
			let section = document.querySelector(link.hash);
			if (
				section.offsetTop <= fromTop &&
				section.offsetTop + section.offsetHeight > fromTop
			) {
				link.classList.add("current");
			} else {
				link.classList.remove("current");
			}
		});
	});

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
			<input
				type="text"
				onChange={handleChange}
				className="searchbox"
				id="emojisearch"
				value={searchInput}
				name="emojis"
				placeholder="Search"
			/>
			<div className="emoji-icons flex" ref={iconRef}>
				<a href="#emotion">
					<Emotion />
				</a>
				<a href="#nature">
					<Nature />
				</a>
				<a href="#food">
					<Food />
				</a>
				<a href="#activities">
					<Events />
				</a>
				<a href="#travel">
					<Transportation />
				</a>
				<a href="#objects">
					<Objects />
				</a>
				<a href="#symbols">
					<Symbols />
				</a>
				<a href="#flags">
					<Flags />
				</a>
			</div>
			{searchInput ? (
				<div className="flex">
					{filteredEmojis.map((emoji) => {
						return <p>{emoji.emoji}</p>;
					})}{" "}
				</div>
			) : (
				<div>
					<div id="emotions">
						Smileys & People
						<div className="flex">
							{smileys.map((emoji) => {
								return <p className="">{emoji.emoji}</p>;
							})}
						</div>
					</div>
					<div id="nature">
						Animals & Nature
						<div className="flex">
							{animals.map((emoji) => {
								return <p className="">{emoji.emoji}</p>;
							})}
						</div>
					</div>
					<div id="food">
						Food & Drink
						<div className="flex">
							{food.map((emoji) => {
								return <p className="">{emoji.emoji}</p>;
							})}
						</div>
					</div>{" "}
					<div id="activities">
						Activities
						<div className="flex">
							{activities.map((emoji) => {
								return <p className="">{emoji.emoji}</p>;
							})}
						</div>
					</div>
					<div id="travel">
						Travel & Places
						<div className="flex">
							{travel.map((emoji) => {
								return <p className="">{emoji.emoji}</p>;
							})}
						</div>
					</div>
					<div id="objects">
						Objects
						<div className="flex">
							{objects.map((emoji) => {
								return <p className="">{emoji.emoji}</p>;
							})}
						</div>
					</div>
					<div id="symbols">
						Symbols
						<div className="flex">
							{symbols.map((emoji) => {
								return <p className="">{emoji.emoji}</p>;
							})}
						</div>
					</div>
					<div id="flags">
						Flags
						<div className="flex">
							{" "}
							{flags.map((emoji) => {
								return <p className="">{emoji.emoji}</p>;
							})}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Emoji;
