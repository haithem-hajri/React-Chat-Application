const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const User = require("../models/User");
const io = require("../server");

exports.addMessage = async (req, res) => {
  var io = req.app.get("socketio");
  Conversation.findOne({
    $and: [
      { members: { $in: req.params.receiverId } },
      { members: { $in: req.user.id } },
    ],
  })

    .then((conver) => {
      if (conver) {
        const newMessage = new Message({
          conversationId: conver.id,
          sender: req.user.id,
          text: req.body.text,
        });
        newMessage
          .save()
          .then((result) => {
            res.status(200).json(result);
            conver.updatedAt = Date.now();
            conver.save();
            User.findOne({ _id: req.params.receiverId }).exec(function (
              err,
              res
            ) {
              if (res != null) {
                io.to(res.socketId).emit("message", result);
                io.to(res.socketId).emit("notifications", {
                  notif: "you have a message",
                  senderId: req.user.id,
                });
                notification = new Notification();
                notification.userId = req.params.receiverId;
                notification.senderId = req.user.id;
                notification.msg = "New Message";
                notification.save();
              }
            });
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      } else {
        const newConversation = new Conversation({
          members: [req.user.id, req.params.receiverId],
        });
        newConversation.save().then((newConversation) => {
          const newMessage = new Message({
            conversationId: newConversation.id,
            sender: req.user.id,
            text: req.body.text,
          });
          newMessage
            .save()
            .then((result) => {
              conver.updatedAt = Date.now();
              conver.save();
              res.status(200).json(result);
              User.findOne({ _id: req.params.receiverId }).exec(function (
                err,
                res
              ) {
                if (res != null) {
                  io.to(res.socketId).emit("message", result);
                  io.to(res.socketId).emit("notifications", {
                    notif: "you have a message",
                    senderId: req.user.id,
                  });
                  notification = new Notification();
                  notification.userId = req.params.receiverId;
                  notification.senderId = req.user.id;
                  notification.msg = "New Message";
                  notification.save();
                }
              });
            })
            .catch((err) => {
              res.status(500).json(err);
            });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getPrivateMessages = (req, res) => {
  Conversation.findOne({
    $and: [
      { members: { $in: req.params.friendId } },
      { members: { $in: req.user.id } },
    ],
  })
    .then((conver) => {
      if (conver) {
        Message.find({ conversationId: { $in: [conver._id] } })
          .then((result) => {
            res.status(200).json(result);
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
