import React, { useState, useContext } from "react";
import "./Navbar.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdArrowDropDown } from "react-icons/md";
import { UserContext } from "../../App";
import axios from "axios";
import { API_URL } from "../../App";
import { Socket } from "../../App";
import MessagesIcon from "../../icons/MessagesIcon";

const Navbar = () => {
  const [isNavExpanded, setIsNavExpanded] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);
  const { state, dispatch } = useContext(UserContext);
  const location = useLocation();
  React.useEffect(() => {
    let isApiSubscribed = true;
    Socket.on("notifications", (msg) => {
      if (isApiSubscribed) {
        //location.pathname !== "/messenger" ||
        if (
          location.pathname !== "/messenger/" + msg.senderId &&
          location.pathname !== "/messenger"
        ) {
          setNotifications((prev) => [...prev, msg]);
        }
      }
    });

    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };
  }, [location.pathname]);
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
          if (
            location.pathname !== "/messenger/" + result.data.senderId &&
            location.pathname !== "/messenger"
          ) {
            setNotifications(result.data);
          }
          
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [state?.user,location.pathname]);

  const navigate = useNavigate();
  const logout = () => {
    setIsNavExpanded(false);
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post(API_URL + "/logout", state?.user, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          dispatch({
            type: "LOGGED_OUT",
            payload: { user: null },
          });
          localStorage.clear();
          navigate("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <div className="navigation">
      <Link to="/" className="brand-name">
        CHAT
      </Link>
      <button
        className="hamburger"
        onClick={() => {
          setIsNavExpanded(!isNavExpanded);
        }}
      >
        {/* icon from heroicons.com */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="white"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div
        className={
          isNavExpanded ? "navigation-menu expanded" : "navigation-menu"
        }
      >
        <ul>
          <li onClick={() => setIsNavExpanded(false)} className="navbar-link">
            <Link className="link" to="/contact">
              Contact Us
            </Link>
          </li>
          {state?.user&&
          <li>
           <Link
           className="notification"
           to="/messenger"
           onClick={() => setNotifications([])}
         >
           <MessagesIcon className="msg-icon" />
           {notifications.length > 0 && (
             <span className="badge">{notifications?.length}</span>
           )}
         </Link>
         </li>}
          <div className="user-block">
            {state?.user ? (
              <div style={{ display: "flex", alignItems: "center" }}>
               
                <div className="logged-in-nav">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span className="username">{state?.user?.name}</span>
                    <img
                      style={{
                        height: "30px",
                        width: "30px",
                        borderRadius: "15px",
                        marginLeft: "4px",
                      }}
                      src={state?.user?.avatar}
                      alt="me"
                    />
                    <MdArrowDropDown />
                  </div>

                  <div className="dropdown-content">
                    <Link
                      to="/mon-profil"
                      onClick={() => setIsNavExpanded(false)}
                    >
                      {" "}
                      mon profil{" "}
                    </Link>
                    <Link to="#" onClick={logout}>
                      {" "}
                      Disconnect{" "}
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <li>
                <Link to="/login" onClick={() => setIsNavExpanded(false)}>
                  <button>Se connecter</button>
                </Link>
              </li>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
