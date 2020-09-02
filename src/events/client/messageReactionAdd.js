const { embedCreateFromEvent } = require("../../utils/functions");

module.exports = async (client, messageReaction, user) => {
  const { message } = messageReaction;
  if (!client.settings) client.settings = await client.getGuild(message.guild);
  if (!message.channel.id === client.settings.eventChannel) return;
  // retrieving the event
  let eventTarget = await client.getEvent({ messageID: message.id });
  if (messageReaction.partial) {
    try {
      await messageReaction.fetch();
    } catch (error) {
      console.log(`probleme partial : ${error.message}`);
    }
  }
  if (eventTarget && eventTarget.isActive) {
    const players = [...eventTarget.players, user.id];
    // update eventTarget variable
    eventTarget = await client.updateEvent(eventTarget, { players });
    const embed = embedCreateFromEvent(client, message, eventTarget);
    // update the event message
    message.edit(embed);
  }
};
