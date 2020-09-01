const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  title: String,
  image: String, // url image for description
  description: String,
  rdv: Date, // date/time of the event
  messageLink: String, // link to discord message
  messageID: String, // discord message ID
  players: [String], // player list
  creator: String, // member guild tag
  createdAt: {
    // id of the event for cancel
    type: Number,
    default: () => Math.floor(Date.now() / 1000),
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Event", eventSchema);
