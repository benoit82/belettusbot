module.exports = async (client, messageReaction, user) => {
  const { message } = messageReaction;
  if (!client.settings) client.settings = await client.getGuild(message.guild);
  if (!message.channel.id === client.settings.eventChannel) return;
  // retrieving the event
  const eventTarget = await client.getEvent({ messageID: message.id });
  if (eventTarget) {
    const players = [...eventTarget.players, user.id];
    await client.updateEvent(eventTarget, { players });
  }
};
