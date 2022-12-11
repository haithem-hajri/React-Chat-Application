import React from "react";
import "./Conversations.scss";
import NewMessage from "../../icons/NewMessage";
import { UserContext } from "../../App";
const Convertations = (props) => {
  const { conversation, notifications } = props;
  const { state } = React.useContext(UserContext);
  const [friend, setFriend] = React.useState(null);

  React.useEffect(() => {
    setFriend(conversation.members.find((m) => m._id !== state?.user?.id));
  }, [conversation, friend, state]);

  return (
    <div className="convertation ">
      <img className="conversation-image" src={friend?.avatar} alt="ok" />
      <div
        style={{ display: "flex", flexDirection: "column", marginLeft: "5px" }}
      >
        <span className="convertation-name">{friend?.name}</span>
        <span className={friend?.isOnline ? "onLine-friend" : "off-friend"}>
          {friend?.isOnline ? "Online" : "Offline"}
        </span>
      </div>

      {friend?._id && notifications?.some((e) => e.senderId === friend._id) && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "16px",
          }}
        >
          <NewMessage />
          <span style={{ marginLeft: "2px", fontSize: "14px" }}>Message</span>
        </div>
      )}
    </div>
  );
};

export default Convertations;
