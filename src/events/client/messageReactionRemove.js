module.exports = async (client, messageReaction, user) => {
  const { message } = messageReaction;
  if (!client.settings) client.settings = await client.getGuild(message.guild);
  if (!message.channel.id === client.settings.eventChannel) return;
  // retrieving the event
  const eventTarget = await client.getEvent({ messageID: message.id });
  if (eventTarget) {
    let players = [...eventTarget.players];
    const i = players.findIndex((el) => el === user.id);
    players = players.filter((u, index) => index !== i);
    console.log(players);
    await client.updateEvent(eventTarget, { players });
  }
};
