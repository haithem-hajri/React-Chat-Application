// declare the express router object for the contact-us route and export it for use in server.js
const express = require("express");
router = express.Router();

//declare Contat Models
const Conversation = require("../models/Conversation");
//create a new contact

exports.conversation = async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
};
//get all my conversation
exports.getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    })
      .populate("members", "_id name avatar email isOnline")
      .sort({ updatedAt: -1 });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};
