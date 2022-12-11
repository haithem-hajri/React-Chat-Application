import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../App";

const ProtectedRoute = ({ children }) => {
  const { state } = useContext(UserContext);

  // const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (token) {
    return children;
  } else {
    return (
      <>
        <Navigate to="/login" replace />
      </>
    );
  }
};

export default ProtectedRoute;
