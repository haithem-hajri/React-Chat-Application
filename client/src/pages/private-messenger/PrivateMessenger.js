import React from "react";
import axios from "axios";
import { API_URL } from "../../App";
import "./PrivateMessenger.scss";
import { useLocation } from "react-router-dom";
import { UserContext } from "../../App";
import { Socket } from "../../App";
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
import onClickOutside from "react-onclickoutside";
import NewMessage from "../../icons/NewMessage";
const PrivateMessenger = () => {
  const [text, setText] = React.useState("");
  const location = useLocation();
  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState(null);
  const { state, dispatch } = React.useContext(UserContext);
  const scrollRef = React.useRef();
  const [chosenEmoji, setChosenEmoji] = React.useState(null);
  const [openChosenEmoji, setOpenChosenEmoji] = React.useState(false);
  const [friend, setFriend] = React.useState({});
  const [updateConversation, setUpdateConversation] = React.useState(false);
  const ref = React.useRef();
  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setText(text + emojiObject.emoji);
  };

  /* -------------------------------------------------------------------------- */
  /*                                  GET USER                                  */
  /* -------------------------------------------------------------------------- */
  React.useEffect(() => {
    let isApiSubscribed = true;
    Socket.on("users", (users) => {
      //  console.log(msg);
      if (isApiSubscribed) {
        setUpdateConversation(true);
      }
    });
    return () => {
      isApiSubscribed = false;
    };
  }, [Socket]);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(API_URL + "/getUserById/" + location?.state?.id, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setFriend(res.data);
        setUpdateConversation(false);
      })
      .catch((err) => {
        console.log("err:", err);
        setUpdateConversation(false);
      });
  }, [location?.state?.id, updateConversation]);
  /* -------------------------------------------------------------------------- */
  /*                               FETCH MESSAGES                               */
  /* -------------------------------------------------------------------------- */
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(API_URL + "/messages/" + location?.state?.id, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        console.log("err:", err);
      });
  }, [location?.state?.id]);

  React.useEffect(() => {
    Socket.on("message", (msg) => {
      setNewMessage(msg);
    });
  }, []);
  React.useEffect(() => {
    newMessage &&
      location?.state?.id === newMessage.sender &&
      setMessages((prev) => [...prev, newMessage]);
  }, [newMessage, location?.state?.id]);
  /* -------------------------------------------------------------------------- */
  /*                                 ADD MESSAGE                                */
  /* -------------------------------------------------------------------------- */
  const sendMessage = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        API_URL + "/message/" + location?.state?.id,
        {
          text,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setText("");
        setMessages([...messages, res.data]);
      })
      .catch((err) => {
        console.log("err:", err);
      });
  };

  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const removeNotification = () => {
    const token = localStorage.getItem("token");
    axios
      .delete(API_URL + "/notifications/" + location?.state?.id, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  onClickOutside(ref, () => setOpenChosenEmoji(false));
  return (
    <div className="private-container">
      <div className="friend-bar">
        <div className="friend-info">
          <img className="friend-image" src={friend?.avatar} alt="ok" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "5px",
            }}
          >
            <span className="friend-name">{friend?.name}</span>
            <span className={friend?.isOnline ? "onLine-friend" : "off-friend"}>
              {friend?.isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
      <div className="private-messages">
        <div className="messages">
          {messages?.map((msg) => {
            return (
              <p
                key={msg?._id}
                ref={scrollRef}
                className={
                  msg.sender === state?.user?.id
                    ? "myMessage"
                    : "friend-message"
                }
              >
                {msg?.text}{" "}
              </p>
            );
          })}
        </div>
        <div className="add-messages">
          <textarea
            placeholder="This is an awesome comment box"
            rows="10"
            name="comment[text]"
            id="comment_text"
            cols="20"
            className="textarea"
            autoComplete="off"
            aria-autocomplete="list"
            aria-haspopup="true"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            onClick={removeNotification}
          />

          <button
            className="emoji-show"
            onClick={() => setOpenChosenEmoji(!openChosenEmoji)}
          >
            😅
          </button>
          {openChosenEmoji && (
            <div ref={ref} className="emoji">
              <Picker
                onEmojiClick={onEmojiClick}
                disableAutoFocus={true}
                native
                skinTone={SKIN_TONE_MEDIUM_DARK}
                style={{
                  position: "absolute",
                  zIndex: 1000,
                  bottom: "10px",
                }}
              />
            </div>
          )}

          <button className="send" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateMessenger;
