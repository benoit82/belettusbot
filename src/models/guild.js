const mongoose = require("mongoose");
const { DEFAULTSETTINGS: defaults } = require("../config");

const guildSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  guildName: String,
  prefix: {
    type: String,
    default: defaults.prefix,
  },
  logChannel: {
    id: {
      type: String,
      default: defaults.logChannel.id,
    },
    name: {
      type: String,
      default: defaults.logChannel.name,
    },
  },
});

module.exports = mongoose.model("Guild", guildSchema);
