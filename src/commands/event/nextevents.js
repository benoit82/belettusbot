const { MESSAGES } = require("../../utils/constants");
const timeInterface = require("../../utils/timeInterface");

module.exports.run = async (client, message, args) => {
  if (args[0] && parseInt(args[0]) === NaN)
    return message.reply("Argument incorrect. Cela doit être un chiffre");
  const days = args[0] ? parseInt(args[0]) : 7;
  let events = await client.getNextActiveEvents(days, message.guild);
  if (events && events.length > 0) {
    events = events.sort((e1, e2) => {
      return e1.rdv > e2.rdv ? 1 : -1;
    });
    events.forEach((evt) => {
      message.channel.send(
        "Titre : **" +
          evt.title +
          "** - Date : **" +
          timeInterface(evt.rdv).format("LLLL") +
          "** - Inscrits : **" +
          evt.players.length +
          "** - Lien message : " +
          evt.messageLink
      );
    });
  } else {
    message.reply(
      `Il n'y a pas d'évènement prévu pour les ${days} jours à venir.`
    );
  }
};

module.exports.help = MESSAGES.COMMANDS.EVENT.NEXTEVENTS;
