import React, { useContext, useEffect, useRef, useState } from "react";
import firebase from "firebase";
import { store } from "../services/firebase";
import {
	ChatContext,
	ContentContext,
	ScreenContext,
} from "../context/ChatsContext";
import { ModalContext, UsersContext } from "../context/ContactsContext";
import ChatList from "./ChatList";

function NewCard() {
	const [email, setEmail] = useState("");
	const [searchError, setSearchError] = useState(null);
	const [screen, setScreen] = useContext(ScreenContext);
	const [chat, setChat] = useContext(ChatContext);
	const [content, setContent] = useContext(ContentContext);
	const [modalOpen, setModalOpen] = useContext(ModalContext);
	const [allUsers, setAllUsers] = useContext(UsersContext);

	let searchInput = useRef();
	const searchRef = useRef();
	const modalRef = useRef();

	useEffect(() => {
		searchInput.focus();

		/** handle click outside emoji div */
		const handleClickOutside = (event) => {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
				setModalOpen(false);
			}
		};

		// Bind the event listener
		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [setModalOpen]);

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
				setEmail("");
				alert("Email invitation sent successfully");
				setModalOpen(false);
				setSearchError(contentReset);
			})
			.catch((err) => {
				alert(err);
			});
	};

	const closeModal = () => {
		setModalOpen(false);
	};

	const createNewChat = (e) => {
		//email regex
		let validateEmail = (email) => {
			let regex = /\S+@\S+\.\S+/;
			return regex.test(email);
		};

		let errorMessage = (userEmail) => {
			searchRef.current.innerHTML = `User '${userEmail}' does not yet exist. <div class='modal-btn flex'><button id='cancel-btn'>Cancel</button>  <button id='mail-btn'>Invite</button> </div> `;
			document
				.getElementById("mail-btn")
				.addEventListener("click", emailInvite, true);
			document
				.getElementById("cancel-btn")
				.addEventListener("click", closeModal, true);
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
							setEmail("");
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

	/** handle form change and trim start to ensure no whitespace can be written to db */
	const handleChange = (e) => {
		setEmail(e.target.value.trimStart());
	};

	const filteredUsers = !email
		? []
		: allUsers
				.filter((chat) => {
					return chat.email.toLowerCase().includes(email.toLowerCase());
				})
				.slice(0, 3);

	return (
		<div className="card new-card" ref={modalRef}>
			<p>New Chat</p>
			<form onSubmit={createNewChat} className="flex">
				<input
					type="text"
					onChange={handleChange}
					className="searchbox"
					id="newChat"
					value={email}
					name="email"
					autoComplete="off"
					placeholder="severus@hogwarts.edu"
					ref={(input) => (searchInput = input)}
				/>
				<div className="error-container">
					<p id="search-error" ref={searchRef}>
						{searchError ? `${searchError}` : ""}
					</p>
				</div>
			</form>

			<div className="">
				{filteredUsers.map((user, id) => {
					return (
						<div className="users-list" key={id}>
							<ChatList
								id={user.email}
								chats={user.email}
								photoURL={user.photoURL}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default NewCard;
