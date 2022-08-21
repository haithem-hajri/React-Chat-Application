const express = require("express");
router = express.Router();
const { requireLogin } = require("../middlware/auth-middlware");
const {
  signup,
  login,
  logout,
  updateUser,
  getUser,
  getAllUsers,
  updateStatus,
  getUserById
} = require("../controllers/auth");
const {
  userSignupValidator,
  userSigninValidator,
  updateUserSchema,
} = require("../validation/auth-validation");
const multer = require("multer");

//================ SET STORAGE

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

var upload = multer({ storage: storage });
var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

const { runValidation } = require("../validation");
router.post(
  "/signup",
  upload.single("avatar"),
  userSignupValidator,
  runValidation,
  signup
);
router.post("/login", userSigninValidator, runValidation, login);
router.get("/getUser", requireLogin, getUser);
router.get("/getUserById/:userId", requireLogin, getUserById);
router.post("/logout", requireLogin, logout);
router.put(
  "/updateUser",
  requireLogin,
  updateUserSchema,
  runValidation,
  updateUser
);
router.get("/users", requireLogin, getAllUsers);
router.put('/status',requireLogin,updateStatus)
module.exports = router;

//// Validate incoming input //updateUserSchema
//const errors = validationResult(req);
