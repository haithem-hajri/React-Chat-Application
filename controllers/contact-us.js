// declare the express router object for the contact-us route and export it for use in server.js
const express = require("express");
router = express.Router();
const { requireLogin } = require("../middlware/auth-middlware");
//declare Contat Models
const Contact = require("../models/Contact");
//create a new contact

exports.createContact = (req, res) => {
  const { name, email, mobile, message } = req.body;
  const contact = new Contact({ name, email, mobile, message });
  contact
    .save()
    .then(() => {
      res.json({
        success: true,
        message: "Contact created successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
//get all contacts
exports.getAllContacts = (req, res) => {
  Contact.find()
    .then((contacts) => {
      res.json(contacts);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
