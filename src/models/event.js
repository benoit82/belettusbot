const mongoose = require("mongoose");
const { EVENT_STATUS } = require("../config");

const eventSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  title: String,
  image: String, // url image for description
  description: String,
  rdv: Date, // date/time of the event
  messageLink: String, // link to discord message
  messageID: String, // discord message ID => index for retrieve an event
  players: [String], // player list
  creator: String, // member guild tag
  createdAt: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000),
  },
  status: {
    type: String,
    default: EVENT_STATUS.open,
  },
});

module.exports = mongoose.model("Event", eventSchema);
