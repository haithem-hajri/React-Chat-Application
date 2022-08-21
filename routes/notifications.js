const express = require("express");
router = express.Router();
const { requireLogin } = require("../middlware/auth-middlware");
const {
  getNotifications,
  deleteNotifications,
} = require("../controllers/notifications");

router.get("/notifications", requireLogin, getNotifications);

//private messages
router.delete("/notifications/:receiverId", requireLogin, deleteNotifications);
//export the router object for use in server.js
module.exports = router;
