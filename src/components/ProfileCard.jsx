/* eslint-disable no-unused-vars */

import React, { useContext, useEffect, useRef, useState } from "react";
import { PhotoURLContext } from "../context/ChatRoomContext";
import UserIcon from "../assets/logo/usericon.png";
import { ReactComponent as Logout } from "../assets/logo/logout_black_24dp.svg";

import { auth } from "../services/firebase";
import { ProfileCardContext } from "../context/ContactsContext";

function ProfileCard() {
  const [user, setUser] = useState(auth().currentUser);
  const [providerURL, setProviderURL] = useContext(PhotoURLContext);
  const [profileOpen, setProfileOpen] = useContext(ProfileCardContext);

  const profileRef = useRef();

  const handleSignOut = () => {
    auth().signOut();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setProfileOpen]);

  return (
    <div className="card-container">
      <div className="card profile-card" ref={profileRef}>
        <div className="profile-head flex">
          <img src={providerURL || UserIcon} alt="user avatar" />
          <p>{user.email}</p>
        </div>
        <div
          role="button"
          aria-label="Signout"
          className="signout flex"
          onClick={handleSignOut}
        >
          <Logout />
          <p>Signout</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
