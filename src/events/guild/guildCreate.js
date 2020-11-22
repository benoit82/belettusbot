const { Guild } = require('../../models')

module.exports = async (client, guild) => {
  // check if guild already exist, then create
  const data = await Guild.findOne({ guildID: guild.id })
  if (!data) {
    client.createGuild({
      guildID: guild.id,
      guildName: guild.name
    })
  }
}
