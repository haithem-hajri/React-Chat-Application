import React from "react";
import "./Messenger.scss";
import Convertations from "../../components/conversations/Conversations";
import Messages from "../../components/Messages/Messages";
import axios from "axios";
import { API_URL } from "../../App";
import { UserContext } from "../../App";
import { Socket } from "../../App";
const Messenger = () => {
  const { state } = React.useContext(UserContext);
  const [conversations, setConversations] = React.useState([]);
  const [conversation, setConversation] = React.useState({});
  const [conversationId, setConvertationId] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [updateConversation, setUpdateConversation] = React.useState(false);
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(API_URL + "/notifications", {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        })
        .then((result) => {
          setNotifications(result.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [state]);

  React.useEffect(() => {
    let isApiSubscribed = true;
    Socket.on("notifications", (msg) => {
      //  console.log(msg);
      if (isApiSubscribed) {
        setNotifications((prev) => [...prev, msg]);
      }
    });
    Socket.on("users", (users) => {
      setUpdateConversation(true);
    });
    return () => {
      isApiSubscribed = false;
    };
  }, [Socket]);

  React.useEffect(() => {
    if (state?.user?.id)
      axios
        .get(API_URL + "/conversation/" + state?.user?.id)
        .then((res) => {
          setConversations(res.data);
          setUpdateConversation(false);
        })
        .catch((err) => {
          setUpdateConversation(false);
        });
  }, [state, updateConversation]);
  //

  const handleConverChange = (conversation) => {
    setConvertationId(conversation._id);
    setConversation(conversation);
  };

  return (
    <div className="messenger-container">
      <div className="convertations-container">
        {conversations.map((c) => {
          return (
            <div
              onClick={() => handleConverChange(c)}
              key={c._id}
              className="isActive"
              style={{ backgroundColor: conversationId === c._id && "#d3edff" }}
            >
              <Convertations conversation={c} notifications={notifications} />
            </div>
          );
        })}
      </div>
      {!conversationId ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
          }}
        >
          <h1 style={{ textAlign: "center" }}>open a Conversation</h1>
        </div>
      ) : (
        <Messages
          conversationId={conversationId}
          conversation={conversation}
          setUpdateConversation={setUpdateConversation}
          notifications={notifications}
          setNotifications={setNotifications}
        />
      )}
    </div>
  );
};

export default Messenger;
