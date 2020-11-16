const { embedCreateFromEvent } = require("../../utils/functions");
const timeInterface = require("../../utils/timeInterface");

module.exports = async (client, messageReaction, user) => {
  if (messageReaction.partial) await messageReaction.fetch();
  const { message } = messageReaction;
  const guildConfig = client.guildsConfig.get(message.guild.id);

  // event case
  if (!message.channel.id === guildConfig.eventChannel) return;

  // retrieving the event
  let eventTarget = await client.getEvent({ messageID: message.id });

  if (eventTarget) {
    if (
      eventTarget.status === client.config.EVENT_STATUS.open &&
      timeInterface(eventTarget.rdv).isAfter(Date.now())
    ) {
      eventTarget.players = eventTarget.players.filter(
        (player) => player.id !== user.id
      );
      const reactEmoji = messageReaction.emoji.id
        ? messageReaction.emoji.id
        : messageReaction.emoji.toString();
      players = [
        ...eventTarget.players,
        { id: user.id, reactEmoji, registrationDate: timeInterface() },
      ];
      // update eventTarget variable
      eventTarget = await client.updateEvent(eventTarget, { players });
      const embed = embedCreateFromEvent(client, message, eventTarget);
      // update the event message
      message.edit(embed);
    } else {
      if (
        eventTarget.status !== client.config.EVENT_STATUS.close &&
        timeInterface(eventTarget.rdv).isBefore(Date.now())
      ) {
        eventTarget = await client.updateEvent(eventTarget, {
          status: client.config.EVENT_STATUS.close,
        });
      }
      const embed = embedCreateFromEvent(client, message, eventTarget);
      // update the event message
      message.edit(embed);
      // the event is canceled or event is before now -> remove all reaction
      message.unpin({ reason: "évènement annulé ou dépassé." });
      messageReaction.remove();
    }
  }
};
