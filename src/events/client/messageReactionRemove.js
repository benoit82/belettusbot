const { embedCreateFromEvent } = require("../../utils/functions");

module.exports = async (client, messageReaction, user) => {
  const { message } = messageReaction;
  if (!client.settings) client.settings = await client.getGuild(message.guild);
  if (!message.channel.id === client.settings.eventChannel) return;
  // retrieving the event
  let eventTarget = await client.getEvent({ messageID: message.id });
  if (eventTarget) {
    if (messageReaction.partial) {
      try {
        await messageReaction.fetch();
      } catch (error) {
        console.log(`probleme partial : ${error.message}`);
      }
    }
    let players = [...eventTarget.players];
    const i = players.findIndex((el) => el === user.id);
    players = players.filter((u, index) => index !== i);
    eventTarget = await client.updateEvent(eventTarget, { players });
    const embed = embedCreateFromEvent(client, message, eventTarget);
    // update the event message
    message.edit(embed);
  }
};
