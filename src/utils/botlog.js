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
    const user = message ? message.author : client.user;
    const embed = new MessageEmbed()
      .setColor(color)
      .setTitle(name)
      .setTimestamp()
      .setDescription(description)
      .setAuthor(user.username, user.avatarURL());

    client.channels.cache.get(client.settings.logChannel).send(embed);
  }
};
