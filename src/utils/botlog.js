const { MessageEmbed } = require("discord.js");
const { TYPE } = require("../config");

module.exports.logAction = (
  client,
  { name, typeInfoLog },
  description,
  message = null
) => {
  if (client.settings.logChannel) {
    const color = TYPE[typeInfoLog]
      ? TYPE[typeInfoLog].color
      : TYPE.default.color;
    const embed = new MessageEmbed()
      .setColor(color)
      .setTitle(name)
      .setTimestamp()
      .setDescription(description);

    if (message) {
      embed.setAuthor(message.author.username, message.author.avatarURL());
    }

    client.channels.cache.get(client.settings.logChannel).send(embed);
  }
};
