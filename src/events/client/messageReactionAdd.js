const { embedCreateFromEvent } = require("../../utils/functions");
const moment = require("moment");

module.exports = async (client, messageReaction, user) => {
  const { message } = messageReaction;
  if (!client.settings) client.settings = await client.getGuild(message.guild);
  if (!message.channel.id === client.settings.eventChannel) return;

  // react emoji check
  let tabAvailableEmojiID = [];
  const tmpTab = Object.entries(client.config.JOB_EMOJI).forEach((role) => {
    Object.entries(role).forEach((job) => {
      if (job[0] === "1")
        tabAvailableEmojiID = [...tabAvailableEmojiID, Object.values(job[1])];
    });
  });
  tabAvailableEmojiID = tabAvailableEmojiID.flat();
  // TODO : si la condition dans le log est vrai, alors c'est un emoji de role sinon on éfface la réaction sans toucher à la BD
  console.log(tabAvailableEmojiID.includes(messageReaction.emoji.id));

  // retrieving the event
  let eventTarget = await client.getEvent({ messageID: message.id });
  if (messageReaction.partial) {
    try {
      await messageReaction.fetch();
    } catch (error) {
      console.log(`problème partial : ${error.message}`);
    }
  }
  if (eventTarget) {
    if (
      eventTarget.status === client.config.EVENT_STATUS.open &&
      moment(eventTarget.rdv).isAfter(Date.now())
    ) {
      const players = [...eventTarget.players, user.id];
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
