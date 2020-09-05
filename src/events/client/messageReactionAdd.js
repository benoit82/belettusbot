const { embedCreateFromEvent } = require("../../utils/functions");
const moment = require("moment");

module.exports = async (client, messageReaction, user) => {
  if (messageReaction.partial) await messageReaction.fetch();
  const { message } = messageReaction;
  if (!client.settings) client.settings = await client.getGuild(message.guild);

  // event case
  if (!message.channel.id === client.settings.eventChannel) return;

  // retrieving the event
  let eventTarget = await client.getEvent({ messageID: message.id });

  if (eventTarget) {
    if (
      eventTarget.status === client.config.EVENT_STATUS.open &&
      moment(eventTarget.rdv).isAfter(moment())
    ) {
      eventTarget.players = eventTarget.players.filter(
        (player) => player.id !== user.id
      );
      const reactEmoji = messageReaction.emoji.id
        ? messageReaction.emoji.id
        : "✅";
      players = [...eventTarget.players, { id: user.id, reactEmoji }];
      // update eventTarget variable
      eventTarget = await client.updateEvent(eventTarget, { players });
      const embed = embedCreateFromEvent(client, message, eventTarget);
      // update the event message
      message.edit(embed);
    } else {
      if (
        eventTarget.status !== client.config.EVENT_STATUS.close &&
        moment(eventTarget.rdv).isBefore(moment())
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
