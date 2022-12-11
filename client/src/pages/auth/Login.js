import React, { useState, useContext } from "react";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { useForm } from "react-hook-form";
import axios from "axios";
import { API_URL } from "../../App";
import { SpinnerCircularSplit } from "spinners-react";
const Login = () => {
  const {
    register,
    handleSubmit,
    //  formState: { errors },
  } = useForm();
  const { dispatch } = useContext(UserContext);
  const [validationErrors, setValidationErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState();
  const navigate = useNavigate();
  const onSubmit = (data) => {
    setLoading(true);
    axios
      .post(API_URL + "/login", data)
      .then((res) => {
        setLoading(false);
        dispatch({
          type: "LOGGED_IN",
          payload: { user: res.data.payload },
        });
        localStorage.setItem("token", res.data.token);
        navigate("/");
      })
      .catch((err) => { 
        setLoading(false);
        setErrors(err.response.data);
        setValidationErrors(err.response.data.error);
        //extracting the errors from validation errors
      });
  };
 
  return (
    <div className="signup">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="signup-header">
          <h1 className="label">Sign in</h1>
          <span>
            You dont have an account ! 
            <Link to="/sign-up">
              <span style={{ fontWeight: "600", cursor: "pointer" }}>
                SignUp
              </span>
            </Link>
          </span>
        </div>

        <input
          className="input"
          {...register("email")}
          type="email"
          name="email"
          placeholder="Email"
          required
        />
      
        {errors && errors.email && (
          <div>
            {" "}
            <p className="error-message">{errors.email}</p>{" "}
          </div>
        )}
        <input
          className="input"
          type="password"
          name="password"
          placeholder="Password"
          required
          {...register("password")} 
        />
       
        {errors && errors.password && (
          <div>
            {" "}
            <p className="error-message">{errors?.password}</p>{" "}
          </div>
        )}
        <button className="button"> {loading && (
                  <SpinnerCircularSplit
                    color="white"
                    size={"25px"}
                    className="mx-2"
                  />
                )}Sign in</button>
      </form>
    </div>
  );
};

export default Login;
