import React from "react";
import "./Users.scss";
import UserCard from "../cards/UserCard";
const Users = () => {
  return (
    <div>
      <div className="onLine">
        <h1>Online Users</h1>
      </div>
      <div>
        <h1 className="offline">
          Offline Users
        </h1>
        <div>
          
          </div>
      </div>
      
    </div>
  );
};

export default Users;
