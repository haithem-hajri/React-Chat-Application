const mongoose = require("mongoose"); // Erase if already required
const { ObjectId } = mongoose.Schema;
const notificationSchema = new mongoose.Schema({ 
  userId: {
   type:String
  },
  senderId:{
    type:String
  },
  msg:{
    type:String
  }
},{
  timestamps:true
});
//Export the model
module.exports = mongoose.model("Notification", notificationSchema);