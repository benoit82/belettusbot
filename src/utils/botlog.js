const { MessageEmbed } = require("discord.js");
const { COLOR, TYPEINFO } = require("../config");

module.exports.logAction = (
  client,
  message,
  { name, typeInfoLog },
  description
) => {
  // color setup.
  let color = "";
  switch (typeInfoLog) {
    case TYPEINFO.INFO:
      color = COLOR.INFO;
      break;
    case TYPEINFO.WARNING:
      color = COLOR.WARNING;
      break;
    case TYPEINFO.DANGER:
      color = COLOR.DANGER;
      break;
    default:
      color = "#7a7a7a"; // grey - no info
      break;
  }
  const embed = new MessageEmbed()
    .setAuthor(message.author.username, message.author.avatarURL())
    .setColor(color)
    .setTitle(name)
    .setTimestamp()
    .setDescription(description);

  client.channels.cache.get("748824009629761568").send(embed);
};
