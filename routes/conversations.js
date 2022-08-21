//declare the express router object for the  route and export it for use in server.js 
const express = require("express");
router = express.Router();
const { requireLogin } = require("../middlware/auth-middlware");
const {conversation , getConversation,getFriendIdConversation}=require ('../controllers/conversations')


router.post("/conversation", conversation);
router.get("/conversation/:userId", getConversation);



//export the router object for use in server.js
module.exports = router;   