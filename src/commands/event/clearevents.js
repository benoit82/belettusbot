const { MESSAGES } = require("../../utils/constants");
module.exports.run = (client, message, args) => {
  client.removeOldEvents(message.channel.guild);
};

module.exports.help = MESSAGES.COMMANDS.EVENT.CLEAREVENTS;
