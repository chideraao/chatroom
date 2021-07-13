import React, { useContext, useEffect, useRef, useState } from "react";
import firebase from "firebase";
import { auth, store } from "../services/firebase";
import {
	ChatContext,
	ContentContext,
	ScreenContext,
} from "../context/ChatsContext";
import ChatList from "./ChatList";
import GroupIcon from "../assets/logo/group_icon.svg";
import { ReactComponent as NewIcon } from "../assets/logo/open_in_new_black_24dp.svg";
import { ReactComponent as MoreIcon } from "../assets/logo/more_horiz_black_24dp.svg";
import ProfileCard from "./ProfileCard";
import { PhotoURLContext } from "../context/ChatRoomContext";
import {
	ModalContext,
	ProfileCardContext,
	UsersContext,
} from "../context/ContactsContext";
import NewCard from "./NewCard";

function Contacts() {
	const [user, setUser] = useState(auth().currentUser);
	const [searchError, setSearchError] = useState(null);
	const [chat, setChat] = useContext(ChatContext);
	const [activeChats, setActiveChats] = useState([]);
	const [screen, setScreen] = useContext(ScreenContext);
	const [input, setInput] = useState({ email: "" });
	const [content, setContent] = useContext(ContentContext);
	const [profileOpen, setProfileOpen] = useContext(ProfileCardContext);
	const [providerURL, setProviderURL] = useContext(PhotoURLContext);
	const [modalOpen, setModalOpen] = useContext(ModalContext);
	const [allUsers, setAllUsers] = useContext(UsersContext);

	const { email } = input;
	const searchRef = useRef();

	useEffect(() => {
		/** initialise and call cloud function to list chats */
		const listActiveChats = firebase
			.functions()
			.httpsCallable("listActiveChats");

		listActiveChats({ docPath: `${user.email}/chats` })
			.then((res) => {
				let collections = res.data.collections;
				setActiveChats(collections);
			})
			.catch((err) => {
				alert(err.message);
			});
		user.providerData.forEach((profile) => {
			setProviderURL(profile.photoURL);
		});

		/**get all users */
		store
			.collection("users")
			.get()
			.then((snapshot) => {
				let users = [];
				snapshot.forEach((doc) => {
					users.push(doc.data());
				});
				setAllUsers(users);
			});
	}, [user, chat, screen, setProviderURL, setAllUsers]);

	/** https callable function to send emails  */
	const emailInvite = () => {
		let contentReset = () => {
			searchRef.current.innerHTML = "";
		};
		const inviteUser = firebase.functions().httpsCallable("inviteUser");

		inviteUser({
			email: email.trim().toLowerCase(),
		})
			.then((res) => {
				console.log(res.data);
				setInput((prevState) => ({ ...prevState, email: "" }));
				alert("Email invitation sent successfully");
				setSearchError(contentReset);
			})
			.catch((err) => {
				alert(err);
			});
	};

	const createNewChat = (e) => {
		//email regex
		let validateEmail = (email) => {
			let regex = /\S+@\S+\.\S+/;
			return regex.test(email);
		};

		let errorMessage = (userEmail) => {
			searchRef.current.innerHTML = `User '${userEmail}' does not yet exist. <button id='mail-btn'>Invite via email?</button> `;
			document
				.getElementById("mail-btn")
				.addEventListener("click", emailInvite, true);
		};

		let trimmedEmail = email.trim().toLowerCase();
		e.preventDefault();
		setSearchError(null);

		if (trimmedEmail === "") {
			setSearchError("User email can not be empty");
		} else if (!validateEmail(trimmedEmail)) {
			setSearchError("Please enter a valid email.");
		} else {
			store
				.collection("users")
				.where("email", "==", trimmedEmail)
				.get()
				.then((docs) => {
					if (docs.size > 0) {
						docs.forEach((doc) => {
							setScreen("chat");
							setContent("");
							setChat(doc.data().email);
							setInput((prevState) => ({ ...prevState, email: "" }));
						});
					} else {
						setSearchError(errorMessage(trimmedEmail));
					}
				})
				.catch((err) => {
					alert(err.message);
				});
		}
	};

	const handleClick = () => {
		setScreen("chatroom");
		setChat(null);
	};

	/** handle form change and trim start to ensure no whitespace can be written to db */
	const handleChange = (e) => {
		setInput((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value.trimStart(),
		}));
	};

	const profileClick = () => {
		setProfileOpen(true);
	};

	const modalClick = () => {
		setModalOpen(true);
	};

	const filteredChats = !email
		? activeChats
		: activeChats.filter((chat) => {
				return chat.toLowerCase().includes(email.toLowerCase());
		  });

	return (
		<div className="contacts">
			<div className="contact-header flex">
				<div className="flex">
					<img src={GroupIcon} alt="logo dhera" />
				</div>

				<div className="flex">
					<div className="svg-container flex" onClick={profileClick}>
						<MoreIcon />
					</div>
					<div className="svg-container flex" onClick={modalClick}>
						<NewIcon />
					</div>
				</div>
				{profileOpen ? <ProfileCard /> : ""}
			</div>
			<form onSubmit={createNewChat} className="flex">
				<input
					type="text"
					onChange={handleChange}
					className="searchbox"
					id="newChat"
					value={email}
					name="email"
					autoComplete="off"
					placeholder="Search Dheragram"
				/>

				<div style={{ width: "100%" }}>
					<p id="search-error" ref={searchRef}>
						{searchError ? `${searchError}` : ""}
					</p>
				</div>
			</form>
			<div className="message-list">
				<div
					className={`group-chat flex ${screen === "chatroom" ? "onChat" : ""}`}
					onClick={handleClick}
				>
					<div className="chat-img">
						<img src={GroupIcon} alt="group avatar" />
					</div>
					<div className="group-title flex">
						<p>Megachat</p>
					</div>
				</div>
				<div className="">
					{filteredChats.map((chat) => {
						return (
							<div className="single-chat" key={chat}>
								<ChatList id={chat} chats={chat} />
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default Contacts;
