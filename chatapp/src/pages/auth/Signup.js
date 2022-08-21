import React, { useState } from "react";
import "./Login.scss";
import { useForm } from "react-hook-form";
import axios from "axios";
import { API_URL } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import { SpinnerCircularSplit } from "spinners-react";
import UploadImage from "../../helper/UploadImage";
const Signup = () => {
  const {
    register,
    handleSubmit,
    //  formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState([]);
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(null);
  const [imageError, setImageError] = useState(false);
  /* -------------------------------------------------------------------------- */
  /*                                  ON SUBMIT                                 */
  /* -------------------------------------------------------------------------- */

  const onSubmit = (data) => {
    setLoading(true);

    if (!images) {
      setImageError(true);
      setLoading(false);
    } else {
      setImageError(false);
      //create form data
      const formData = new FormData();
      formData.append("avatar", images[0].file);
      formData.append("email", data.email);
      formData.append("name", data.name);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);

      axios
        .post(API_URL + "/signup", formData)
        .then((res) => {
          navigate("/login");
          setLoading(false);
        })
        .catch((err) => {
          setErrors(err.response.data);
          setValidationErrors(err.response.data.error);
          setLoading(false);
        });
    }
  };

  return (
    <div className="signup">
      <div className="signup-header">
        <h1 className="label">Sign Up</h1>
        <span>
          you have an account !
          <Link to="/login">
            <span style={{ fontWeight: "600", cursor: "pointer" }}>SignIn</span>
          </Link>
        </span>
      </div>
      <div className="image-upload">
        {/* UPLOAD IMAGE */}
        <UploadImage
          imageError={imageError}
          images={images}
          setImages={setImages}
          setImageError={setImageError}
        />
        {/****************/}
      </div>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("name")}
          className="input"
          type="text"
          name="name"
          placeholder="User name"
          required=""
        />
        {validationErrors &&
          validationErrors.map((message, i) =>
            message.param && message.param === "name" ? (
              <div key={i}>
                <p className="error-message">{message.msg}</p>
              </div>
            ) : null
          )}
        {errors && errors.name && (
          <div>
            {" "}
            <p className="error-message">{errors.name}</p>{" "}
          </div>
        )}
        <input
          {...register("email")}
          className="input"
          type="email"
          name="email"
          placeholder="Email"
          required=""
        />
        {validationErrors &&
          validationErrors.map((message, i) =>
            message.param && message.param === "email" ? (
              <div key={i}>
                <p className="error-message">{message.msg}</p>
              </div>
            ) : null
          )}
        {errors && errors.user_exist && (
          <div>
            {" "}
            <p className="error-message">{errors.user_exist}</p>{" "}
          </div>
        )}
        <input
          {...register("password")}
          className="input"
          type="password"
          name="password"
          placeholder="Password"
          required=""
        />
        {validationErrors &&
          validationErrors.map((message, i) =>
            message.param && message.param === "password" ? (
              <div key={i}>
                <p className="error-message">{message.msg}</p>
              </div>
            ) : null
          )}
        {errors && errors.password && (
          <div>
            {" "}
            <p className="error-message">{errors.password}</p>{" "}
          </div>
        )}
        <input
          {...register("confirmPassword")}
          className="input"
          type="password"
          name="confirmPassword"
          placeholder="Password"
          required=""
        />
        {validationErrors &&
          validationErrors.map((message, i) =>
            message.param && message.param === "confirmPassword" ? (
              <div key={i}>
                <p className="error-message">{message.msg}</p>
              </div>
            ) : null
          )}
        {errors && errors.confirmPassword && (
          <div>
            {" "}
            <p className="error-message">{errors.confirmPassword}</p>{" "}
          </div>
        )}
        <button disabled={loading} type="submit" className="button">
          {loading && (
            <SpinnerCircularSplit
              color="white"
              size={"25px"}
              className="mx-2"
            />
          )}
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Signup;
