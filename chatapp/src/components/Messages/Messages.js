import React from "react";
import "./Messages.scss";
import axios from "axios";
import { API_URL } from "../../App";
import { UserContext } from "../../App";
import { Socket } from "../../App";
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
import onClickOutside from "react-onclickoutside";
const Messages = (props) => {
  const {
    conversationId,
    conversation,
    setUpdateConversation,
    notifications,
    setNotifications,
  } = props;
  const [messages, setMessages] = React.useState(null);
  const [text, setText] = React.useState("");
  const { state, dispatch } = React.useContext(UserContext);
  const [newMessage, setNewMessage] = React.useState(null);
  const [chosenEmoji, setChosenEmoji] = React.useState(null);
  const scrollRef = React.useRef();
  const [openChosenEmoji, setOpenChosenEmoji] = React.useState(false);
  const ref = React.useRef();
  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setText(text+emojiObject.emoji); 
  };
  React.useEffect(() => {
    if (conversationId !== undefined) {
      axios
        .get(API_URL + "/message/" + conversationId)
        .then((res) => {
          setMessages(res.data);
        })
        .catch((err) => {
          // console.log("err:", err);
        });
    }
  }, [conversationId]);

  React.useEffect(() => {
    Socket.on("message", (msg) => {
      setNewMessage(msg);
    });
  }, []);
  React.useEffect(() => {
    newMessage &&
      conversationId === newMessage.conversationId &&
      setMessages((prev) => [...prev, newMessage]);
  }, [newMessage, conversationId]);
  const sendMessage = () => {
    const token = localStorage.getItem("token");
    const receiverId = conversation?.members.find(
      (element) => element._id !== state?.user?.id
    );
    axios
      .post(
        API_URL + "/message/" + receiverId._id,
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
        setMessages([...messages, res.data]);
        setUpdateConversation(true);
        setText("");
      })
      .catch((err) => {
        console.log("err_msg:", err);
      });
  };
  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const removeNotification = () => {
    const token = localStorage.getItem("token");
    const receiverId = conversation?.members.find(
      (element) => element._id !== state?.user?.id
    );
    if (receiverId) {
      axios
        .delete(API_URL + "/notifications/"+ receiverId?._id, { 
          headers: {
            Authorization: token,
            "Content-Type": "application/json", 
          },
        })
        .then((res) => {
          setNotifications(
            notifications.filter(
              (notification) => notification.senderId !== receiverId._id
            )
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <div className="messages-container">
      <div className="messages">
        {messages?.map((msg) => {
          return (
            <p
              ref={scrollRef}
              key={msg?._id}
              className={
                msg.sender === state?.user?.id ? "myMessage" : "friend-message"
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
  );
};

export default Messages;
