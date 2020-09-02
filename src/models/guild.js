const mongoose = require("mongoose");
const { DEFAULTSETTINGS: defaults } = require("../config");

const guildSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  guildName: String,
  logChannel: {
    type: String,
    default: defaults.logChannel,
  },
  eventChannel: {
    type: String,
    default: defaults.eventChannel,
  },
  prefix: {
    type: String,
    default: defaults.prefix,
  },
});

module.exports = mongoose.model("Guild", guildSchema);
