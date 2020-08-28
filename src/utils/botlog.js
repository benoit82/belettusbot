const { MessageEmbed } = require("discord.js");
const { TYPE } = require("../config");

module.exports.logAction = (
  client,
  message,
  { name, typeInfoLog },
  description
) => {
  const color = TYPE[typeInfoLog]
    ? TYPE[typeInfoLog].color
    : TYPE.default.color;

  const embed = new MessageEmbed()
    .setAuthor(message.author.username, message.author.avatarURL())
    .setColor(color)
    .setTitle(name)
    .setTimestamp()
    .setDescription(description);

  client.channels.cache.get("748824009629761568").send(embed);
};
