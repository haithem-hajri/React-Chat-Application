const mongoose = require("mongoose"); // Erase if already required
const { ObjectId } = mongoose.Schema;
// Declare the Schema of the Mongo model
const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
//Export the model
module.exports = mongoose.model("Conversation", conversationSchema);
