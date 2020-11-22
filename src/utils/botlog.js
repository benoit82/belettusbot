const { MessageEmbed } = require('discord.js')
const { TYPE } = require('../config')

/**
 *
 * @param {Client} client
 * @param {Message} message origine du message
 * @param {Help} help doit contenu les variable name et typeInfoLog
 * @param {String} description détail du log
 */
module.exports.logAction = (client, message, help, description) => {
  const { name, typeInfoLog } = help
  const guildConfig = client.guildsConfig.get(message.guild.id)
  if (guildConfig.logChannel) {
    const color = TYPE[typeInfoLog]
      ? TYPE[typeInfoLog].color
      : TYPE.default.color
    const embed = new MessageEmbed()
      .setColor(color)
      .setTitle(name)
      .setTimestamp()
      .setDescription(description)
      .setAuthor(message.author.username, message.author.avatarURL())
    client.channels.cache.get(guildConfig.logChannel).send(embed)
  }
}
