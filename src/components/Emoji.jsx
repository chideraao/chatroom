/* eslint-disable no-unused-vars */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import emojis from "../assets/emojiList.json";
import firebase from "firebase";
import { ReactComponent as Emotion } from "../assets/logo/emoji_emotions_white_24dp.svg";
import { ReactComponent as Nature } from "../assets/logo/emoji_nature_white_24dp.svg";
import { ReactComponent as Food } from "../assets/logo/emoji_food_beverage_white_24dp.svg";
import { ReactComponent as Events } from "../assets/logo/emoji_events_white_24dp.svg";
import { ReactComponent as Objects } from "../assets/logo/emoji_objects_white_24dp.svg";
import { ReactComponent as Transportation } from "../assets/logo/emoji_transportation_white_24dp.svg";
import { ReactComponent as Symbols } from "../assets/logo/emoji_symbols_white_24dp.svg";
import { ReactComponent as Flags } from "../assets/logo/emoji_flags_white_24dp.svg";
import { ReactComponent as Recent } from "../assets/logo/schedule_white_24dp.svg";
import {
  ContentContext,
  EmojiContext,
  ScreenContext,
} from "../context/ChatsContext";
import { auth, store } from "../services/firebase";
import { ChatroomContentContext } from "../context/ChatRoomContext";

function Emoji() {
  const [user, setUser] = useState(auth().currentUser);
  const [searchInput, setSearchInput] = useState("");
  const [scrollText, setScrollText] = useState();
  const [recent, setRecent] = useState([]);
  const [content, setContent] = useContext(ContentContext);
  const [emojiOpen, setEmojiOpen] = useContext(EmojiContext);
  const [screen, setScreen] = useContext(ScreenContext);
  const [roomContent, setRoomContent] = useContext(ChatroomContentContext);

  const iconRef = useRef();
  let emojiSearch = useRef();

  /** sticky emoji.category function*/
  const handleScroll = useCallback(() => {
    const links = iconRef.current.querySelectorAll("a");
    let fromTop = iconRef.current.scrollTop + 24;

    links.forEach((link) => {
      let section = document.querySelector(link.hash);
      let sectionID = section?.classList.value;
      if (
        section?.offsetTop <= fromTop &&
        section?.offsetTop + section?.offsetHeight > fromTop
      ) {
        setScrollText(sectionID);
        link.classList.add("current");
      } else {
        link.classList.remove("current");
      }
    });
  }, []);

  useEffect(() => {
    emojiSearch.focus();
    iconRef.current.addEventListener("scroll", handleScroll);

    try {
      store
        .collection("users")
        .doc(user.uid)
        .onSnapshot((doc) => {
          let recents = [];
          if (doc.data() !== undefined) {
            recents = doc.data().recentEmojis;
            recents = recents.reverse().slice(0, 35);
          }
          setRecent(recents);
        });
    } catch (err) {
      console.log(err.message);
    }

    /** handle click outside emoji div */
    const handleClickOutside = (event) => {
      if (iconRef.current && !iconRef.current.contains(event.target)) {
        setEmojiOpen(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleScroll, user, setEmojiOpen]);

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

  const handleClick = (e) => {
    if (screen === "chatroom") {
      setRoomContent((prevState) => prevState + e.target.innerText);
    } else {
      setContent((prevState) => prevState + e.target.innerText);
    }

    store
      .collection("users")
      .doc(user.uid)
      .update({
        recentEmojis: firebase.firestore.FieldValue.arrayUnion(
          e.target.innerText
        ),
      });
    setTimeout(() => {
      setEmojiOpen(false);
    }, 500);
  };

  const filteredEmojis = !searchInput
    ? emojis
    : emojis
        .filter((emoji) => {
          return (
            emoji.description
              .toLowerCase()
              .includes(searchInput.toLowerCase()) ||
            emoji.tags.toLowerCase().includes(searchInput.toLowerCase()) ||
            emoji.aliases.toLowerCase().includes(searchInput.toLowerCase())
          );
        })
        .slice(0, 70);

  return (
    <div className="emoji-container">
      <div className="card-container">
        <div className="card emoji-card" ref={iconRef}>
          {scrollText === undefined || scrollText === "RECENT" ? null : (
            <p className="scroll-text">{scrollText}</p>
          )}
          <input
            type="text"
            onChange={handleChange}
            className="searchbox"
            id="emojisearch"
            value={searchInput}
            name="emojis"
            placeholder="Search"
            autoComplete="off"
            ref={(input) => (emojiSearch = input)}
          />

          <div className="emoticons flex">
            <a href="#recent">
              <Recent />
            </a>
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
            <div className="emojis flex">
              {filteredEmojis.map((emoji) => {
                return (
                  <p
                    key={emoji.emoji}
                    onClick={handleClick}
                    value={content}
                    name="content"
                    title={emoji.description}
                    role="button"
                    aria-label={`${emoji.description} emoji`}
                  >
                    {emoji.emoji}
                  </p>
                );
              })}{" "}
            </div>
          ) : (
            <div className="emojis">
              <div className="RECENT" id="recent">
                <p>RECENT</p>
                {recent !== [] ? (
                  <div className="flex">
                    {recent.map((emoji) => {
                      return (
                        <p
                          key={emoji}
                          onClick={handleClick}
                          value={content}
                          name="content"
                          title={emoji.description}
                          role="button"
                          aria-label={`${emoji.description} emoji`}
                        >
                          {emoji}
                        </p>
                      );
                    })}
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="SMILEYS & PEOPLE" id="emotion">
                <p>SMILEYS & PEOPLE</p>
                <div className="flex">
                  {smileys.map((emoji) => {
                    return (
                      <p
                        key={emoji.emoji}
                        onClick={handleClick}
                        value={content}
                        name="content"
                        title={emoji.description}
                        role="button"
                        aria-label={`${emoji.description} emoji`}
                      >
                        {emoji.emoji}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="ANIMALS & NATURE" id="nature">
                <p> ANIMALS & NATURE</p>
                <div className="flex">
                  {animals.map((emoji) => {
                    return (
                      <p
                        key={emoji.emoji}
                        onClick={handleClick}
                        value={content}
                        name="content"
                        title={emoji.description}
                        role="button"
                        aria-label={`${emoji.description} emoji`}
                      >
                        {emoji.emoji}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="FOOD & DRINK" id="food">
                <p>FOOD & DRINK</p>
                <div className="flex">
                  {food.map((emoji) => {
                    return (
                      <p
                        key={emoji.emoji}
                        onClick={handleClick}
                        value={content}
                        name="content"
                        title={emoji.description}
                        role="button"
                        aria-label={`${emoji.description} emoji`}
                      >
                        {emoji.emoji}
                      </p>
                    );
                  })}
                </div>
              </div>{" "}
              <div className="ACTIVITIES" id="activities">
                <p>ACTIVITIES</p>
                <div className="flex">
                  {activities.map((emoji) => {
                    return (
                      <p
                        key={emoji.emoji}
                        onClick={handleClick}
                        value={content}
                        name="content"
                        title={emoji.description}
                        role="button"
                        aria-label={`${emoji.description} emoji`}
                      >
                        {emoji.emoji}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="TRAVEL & PLACES" id="travel">
                <p>TRAVEL & PLACES</p>
                <div className="flex">
                  {travel.map((emoji) => {
                    return (
                      <p
                        key={emoji.emoji}
                        onClick={handleClick}
                        value={content}
                        name="content"
                        title={emoji.description}
                        role="button"
                        aria-label={`${emoji.description} emoji`}
                      >
                        {emoji.emoji}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="OBJECTS" id="objects">
                <p>OBJECTS</p>
                <div className="flex">
                  {objects.map((emoji) => {
                    return (
                      <p
                        key={emoji.emoji}
                        onClick={handleClick}
                        value={content}
                        name="content"
                        title={emoji.description}
                        role="button"
                        aria-label={`${emoji.description} emoji`}
                      >
                        {emoji.emoji}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="SYMBOLS" id="symbols">
                <p>SYMBOLS</p>
                <div className="flex">
                  {symbols.map((emoji) => {
                    return (
                      <p
                        key={emoji.emoji}
                        onClick={handleClick}
                        value={content}
                        name="content"
                        title={emoji.description}
                        role="button"
                        aria-label={`${emoji.description} emoji`}
                      >
                        {emoji.emoji}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="FLAGS" id="flags">
                <p>FLAGS</p>
                <div className="flex">
                  {" "}
                  {flags.map((emoji) => {
                    return (
                      <p
                        key={emoji.emoji}
                        onClick={handleClick}
                        value={content}
                        name="content"
                        title={emoji.description}
                        role="button"
                        aria-label={`${emoji.description} emoji`}
                      >
                        {emoji.emoji}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Emoji;
