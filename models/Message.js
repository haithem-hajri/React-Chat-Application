const mongoose = require("mongoose"); // Erase if already required
const { ObjectId } = mongoose.Schema;
const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);
//Export the model
module.exports = mongoose.model("Message", messageSchema);
