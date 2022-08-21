// auth controllers
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const JWT_SECRET = process.env.JWT_SECRET_PROD || "secret";
//signup user and check if user exist and crypt paswword with bcryptjs and send a success message to the client side in json format
exports.signup = (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  User.findOne({
     email: req.body.email 
  })
    .then((user) => {
      if (user) {
        return res
          .status(400)
          .json({ user_exist: "Email or phone already exists" });
      } else {
        const newUser = new User({
          avatar: url + "/uploads/" + req.file.filename,
          email: req.body.email,
          name: req.body.name,
          password: req.body.password,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => { 
            if (err) throw err;
            newUser.password = hash;
            // newUser.avatar = null;
            newUser.save().then((user) => {
              res.status(201).json("signup success");
            });
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

// login
exports.getUserById = (req, res) => {
  User.findOne({ _id: req.params.userId })
  .select('-password')
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ email: "Email not found" });
      }

      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            const payload = {
              id: user.id,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
            };
            jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
              if (err) throw err;

              user.save().then((user) => {
                res.json({
                  payload,
                  loggedIn: true,
                  token: "Bearer " + token,
                });
              });
            });
          } else {
            return res.status(400).json({ password: "Password incorrect" });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
// logout
exports.logout = (req, res) => {
  var io = req.app.get("socketio");
  const { id } = req.body;
  User.findById(id).then((user) => {
    user.isOnline = false;
    user.save().then((result) => {
      res.json({
        loggedIn: false,
        message: "Logged out successfully",
      });
      User.find()
        .select("-password")
        .then(function (users) {
          io.emit("users", users);
        });
    });
  });
};

// get user by token  and send user data to the client side
exports.getUser = (req, res) => {
  const { id } = req.user;
  User.findById(id)
    .then((user) => {
      res.json({
        loggedIn: true,
        payload: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
//get all users

exports.getAllUsers = (req, res) => {
  User.find({ _id: { $not: { $in: [req.user.id] } } })
    .sort({ isOnline: -1 })
    .select("-password")
    .then(function (users) {
      res.send(users);
    });
};
exports.updateStatus = (req, res) => {
  const id = req.user.id;
  User.findOneAndUpdate(
    { _id: id },
    { isOnline: false },
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    }
  );
};
// update user email name and mobile

exports.updateUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const id = req.user.id;
  const { email, name } = req.body;
  User.findById(id)
    .then((user) => {
      if (email) {
        user.email = email;
      }
      if (name) {
        user.name = name;
      }

      user.save().then((user) => {
        res.json({
          loggedIn: true,
          payload: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
          },
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
