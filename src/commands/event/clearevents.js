const { MESSAGES } = require("../../utils/constants");
module.exports.run = (client, message, args) => {
  client.removeOldEvents(message.channel.guild, message);
};

module.exports.help = MESSAGES.COMMANDS.EVENT.CLEAREVENTS;
