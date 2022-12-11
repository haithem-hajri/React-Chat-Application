const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const user = require("./routes/auth");
const contact = require("./routes/contact-us");
const conversations = require("./routes/conversations");
const messages = require("./routes/messages");
const notifications = require("./routes/notifications");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const User = require("./models/User");
const PORT = process.env.PORT || 5000;
require("dotenv").config();

mongoose.Promise = global.Promise;

/* -------------------------------------------------------------------------- */
/*                              CONNECT DATABASE                              */
/* -------------------------------------------------------------------------- */
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
  },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection: " + err);
    }
  }
);
/* -------------------------------------------------------------------------- */
/*                                SOCKET SERVER                               */
/* -------------------------------------------------------------------------- */
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://chat-rogk.onrender.com",
  },
}); //in case server and client run on different urls
// online users

io.on("connection", (socket) => {
  socket.on("connect_user", (userId) => {
    var c = User.findByIdAndUpdate(
      userId,
      { socketId: socket.id, isOnline: true },
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          // console.log("res:", result);
        }
      }
    );
    //{ _id: { $not: { $in: [userId] } } }
    User.find()
      .select("-password")

      .then(function (users) {
        io.emit("users", users);
      });
  });

  socket.on("disconnect", () => {
    var c = User.findOne({ socketId: socket.id })
      .then((user) => {
        if (user) {
          user.isOnline = false;
          user.save().then((result) => {
            User.find()
              .select("-password")
              .then(function (users) {
                io.emit("users", users);
              })
              .catch((err) => {
                console.log(err);
              });
          });
        }
      })
      .catch((err) => {
        console.log("err:", err); 
      });
  });
});

/* -------------------------------------------------------------------------- */
/*                                   ROUTES                                   */
/* -------------------------------------------------------------------------- */
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.set("socketio", io);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", user);
app.use("/api", contact);
app.use("/api", conversations);
app.use("/api", messages);
app.use("/api", notifications);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("chatapp/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "chatapp", "build", "index.html"));
  });
}

/* -------------------------------------------------------------------------- */
/*                               CONNECT SERVER                               */
/* -------------------------------------------------------------------------- */
server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Server running on- Port ", PORT);
});
