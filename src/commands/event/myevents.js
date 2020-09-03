const { MESSAGES } = require("../../utils/constants");
const moment = require("moment");
moment.locale("fr");

module.exports.run = async (client, message, args) => {
  let events = await client.getEventByCreator(message.author);
  if (events) {
    events = events.sort((e1, e2) => {
      return e1.rdv > e2.rdv ? 1 : -1;
    });
    events.forEach((evt) => {
      const status =
        evt.status === client.config.EVENT_STATUS.open ? "Actif" : "Annulé";
      message.channel.send(
        "ID : `" +
          evt.messageID +
          "` - Titre : **" +
          evt.title +
          "** - Date : **" +
          moment(evt.rdv).format("LLLL") +
          "**\nStatus : **" +
          status +
          "** - Inscrits : **" +
          new Set(evt.players).size +
          "** - Lien message : " +
          evt.messageLink
      );
    });
  } else {
    message.reply("Tu n'as pas d'évènement créé en cours.");
  }
};

module.exports.help = MESSAGES.COMMANDS.EVENT.MYEVENTS;
