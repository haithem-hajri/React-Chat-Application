const express = require("express");
router = express.Router();
const { requireLogin } = require("../middlware/auth-middlware");
const {createMessage , getMessages , addMessage,getPrivateMessages} = require ('../controllers/messages');


router.post("/message/:receiverId", requireLogin,addMessage);
router.get("/message/:conversationId", getMessages);

//private messages
router.get('/messages/:friendId',requireLogin,getPrivateMessages)
//export the router object for use in server.js
module.exports = router;   