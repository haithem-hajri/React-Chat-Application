const Notification = require("../models/Notification");

exports.getNotifications = (req, res) => {
  const Id = req.user.id;
  Notification.find({ userId: req.user.id })
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
//get all contacts
exports.deleteNotifications = (req, res) => {
  const Id = req.user.id;
  Notification.remove({ userId: Id, senderId: req.params.receiverId })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
