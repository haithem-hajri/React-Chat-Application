import React from "react";
import "./UserCard.scss";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const UserCard = (props) => {
  const { user } = props;
  const navigate = useNavigate();
  const NavigateTo = () => {
    navigate(`/messenger/${user._id}`, {
      state: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        isOnline: user.isOnline,
      },
    });
  };
  return (
    <div className="card-container">
      <img className="round" src={user?.avatar} alt="user" />
      <span className={user?.isOnline ? "on" : "off"}></span>
      <h3>{user?.name}</h3>

      <button onClick={NavigateTo} className="primary">
        Message
      </button>
    </div>
  );
};

export default UserCard;
