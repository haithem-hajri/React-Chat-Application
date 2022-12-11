import React from "react";
import UserCard from "../../components/cards/UserCard";
import "./Home.scss";
import { API_URL } from "../../App";
import axios from "axios";
import { Socket } from "../../App";
const Home = () => {
  const [Users, setUsers] = React.useState([]);
  const [status, setStatus] = React.useState(false);
  React.useEffect(() => {
    Socket.on("users", (users) => {
      setStatus(true);
    });
    const token = localStorage.getItem("token");
    axios
      .get(API_URL + "/users", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json", 
        },
      })
      .then((res) => {
        setUsers(res.data);
        setStatus(false);
      })
      .catch((err) => {
        console.log(err);
        setStatus(false);
      });
  }, [status]);
  return (
    <div className="home-container">
      <h1>Users</h1>
      <div className="users-container">
        {Users?.map((user) => {
          return <UserCard key={user._id} user={user} />; 
        })}
      </div>
    </div>
  );
};

export default Home;
