const { MESSAGES } = require("../../utils/constants");
const { embedCreateFromEvent } = require("../../utils/functions");
const moment = require("moment");
moment.locale("fr");

module.exports.run = async (client, message, args) => {
  const { settings, channels } = client;
  const helpCmd = `
  Pour plus d'information sur la commande, tapes la commande \`${settings.prefix}help ${this.help.name}\``;
  if (!args[0].match(client.config.REGEX.DISCORD_ID_FORMAT))
    return message.reply(`L'ID est mal saisie.${helpCmd}`);
  let eventTarget = await client.getEvent({ messageID: args[0] });
  if (eventTarget) {
    eventTarget = await client.updateEvent(eventTarget, {
      status: client.config.EVENT_STATUS.cancel,
    });
    const evtChannel = await channels.fetch(settings.eventChannel);
    const originalMsg = await evtChannel.messages.fetch(eventTarget.messageID);
    const embed = embedCreateFromEvent(client, originalMsg, eventTarget);
    originalMsg.edit(embed);
    if (originalMsg.pinned) originalMsg.unpin();
    message.reply(`Evènement \`${eventTarget.messageID}\` annulé.`);
    // warn all players registered => event is now canceled
    let players = new Set(eventTarget.players);
    if (players.size > 0) {
      players.delete(message.author.id);
      if (players.size > 0) {
        message.channel.send(
          "Je préviens les autres inscrits de son annulation.😗"
        );
        players.forEach((player) => {
          client.users.cache
            .get(player)
            .send(
              `L'évènement **${eventTarget.title}** prévu pour le **${moment(
                eventTarget.rdv
              ).format("LLLL")}**, vient d'être annulé par <@${
                message.author.id
              }>.`
            );
        });
      }
    }
  } else {
    return message.reply(`ID invalide.${helpCmd}`);
  }
};

module.exports.help = MESSAGES.COMMANDS.EVENT.CANCELEVENT;
