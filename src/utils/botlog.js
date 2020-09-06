const { MessageEmbed } = require("discord.js");
const { TYPE } = require("../config");

module.exports.logAction = (
  client,
  { name, typeInfoLog },
  description,
  message
) => {
  const guildConfig = client.guildsConfig.get(message.guild.id);
  if (guildConfig.logChannel) {
    const color = TYPE[typeInfoLog]
      ? TYPE[typeInfoLog].color
      : TYPE.default.color;
    const embed = new MessageEmbed()
      .setColor(color)
      .setTitle(name)
      .setTimestamp()
      .setDescription(description)
      .setAuthor(message.author.username, message.author.avatarURL());
  }

  client.channels.cache.get(guildConfig.logChannel).send(embed);
};
