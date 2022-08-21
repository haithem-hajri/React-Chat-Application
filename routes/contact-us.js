//declare the express router object for the contact-us route and export it for use in server.js 
const express = require("express");
router = express.Router();
const { requireLogin } = require("../middlware/auth-middlware");
const {
  createContact,
  getAllContacts,
} = require("../controllers/contact-us");

//create a new contact
router.post("/ContactUs", createContact);
//get all contacts
router.get("/getAllContacts", requireLogin, getAllContacts);


//export the router object for use in server.js
module.exports = router;  