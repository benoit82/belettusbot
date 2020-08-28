module.exports = async (client, guild) => {
  const newGuild = {
    guildID: guild.id,
    guidName: guild.name,
  };
  await client.createGuild();
};
