import React, { createContext, useReducer, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";

// import Navbar from "./components/navbar/Navbar";
import { reducer, initialState } from "./reducers/Reducers";
// import Home from "./pages/Home/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import MyProfile from "./pages/MyProfile";
import axios from "axios";
import Footer from "./components/Footer/Footer";
import Messenger from "./pages/messenger/Messenger";
import { io } from "socket.io-client";
import ProtectedRoute from "./components/ProtectedRoute";
import PrivateMessenger from "./pages/private-messenger/PrivateMessenger";
const Navbar = React.lazy(() => import("./components/navbar/Navbar"));
const Home = React.lazy(() => import("./pages/Home/Home"));
export const UserContext = createContext(null);
export const API_URL = "https://msn-clone.herokuapp.com/api";
//https://msn-clone.herokuapp.com/api
//http://localhost:5000/api
export const Socket = io("https://msn-clone.herokuapp.com");
//http://localhost:5000
const Routing = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <React.Suspense fallback={<div>Loading ... !</div>}>
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          </React.Suspense>
        }
      />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<Signup />} />
      <Route
        path="/mon-profil"
        element={
          <ProtectedRoute>
            {" "}
            <MyProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messenger"
        element={
          <ProtectedRoute>
            <Messenger />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messenger/:friendId"
        element={
          <ProtectedRoute>
            <PrivateMessenger />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  React.useEffect(() => {
    if (state?.user) {
      const token = localStorage.getItem("token");

      Socket.on("connection", () => {});
      Socket.emit("connect_user", state?.user?.id);
      // Socket.emit('disconnect', state?.user?.id);
      Socket.on("disconnect", () => {
        //  Socket.emit('update_status', state?.user?.id);
        console.log("user disconnect");
      });
    }
  }, [state?.user]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      //get user axios
      axios
        .get(API_URL + "/getUser", {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          dispatch({
            type: "LOGGED_IN",
            payload: { user: res.data.payload },
          });
        })
        .catch((err) => {
          dispatch({
            type: "LOGGED_OUT",
            payload: { user: null },
          });
          localStorage.clear();
        });
    } else {
      dispatch({
        type: "LOGGED_OUT",
        payload: { user: null },
      });
      localStorage.clear();
    }
  }, []);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <React.Suspense fallback={<div>Loading ... !</div>}>
          <Navbar />
          <div className="body">
            <Routing />
          </div>
          <Footer />
        </React.Suspense>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
