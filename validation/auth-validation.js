// declare express validator
const { check, validationResult } = require("express-validator");
const User = require("../models/User");

exports.userSignupValidator = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  //confirme password
  check("confirmPassword").custom((value, { req }) => {
    if (value === "") {
      throw new Error("Confirm Password is required");
    }
    if (value !== req.body.password) {
      throw new Error("Password confirmation is incorrect");
    } else {
      return value;
    }
  }),
];

exports.userSigninValidator = [
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];


// update user validator email unique
exports.updateUserSchema = [
  check("email")
  .custom((value, { req }) => {
    return User.findOne({ email: value })
      .then(user => {
        if (user) {
          if (user.id !== req.body.id) {
            return Promise.reject("Email already exists");
          }
          return true;
        }
      });
  }),


  

];
