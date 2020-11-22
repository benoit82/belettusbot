const mongoose = require('mongoose')
const { DEFAULTSETTINGS: defaults } = require('../config')

const guildSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  guildName: String,
  logChannel: {
    type: String,
    default: defaults.logChannel
  },
  eventChannel: {
    type: String,
    default: defaults.eventChannel
  },
  prefix: {
    type: String,
    default: defaults.prefix
  },
  reactRoles: {
    Tanks: { type: Array, default: [] },
    Healers: { type: Array, default: [] },
    DPS: { type: Array, default: [] },
    Flex: { type: Array, default: [] }
  }
})

module.exports = mongoose.model('Guild', guildSchema)
