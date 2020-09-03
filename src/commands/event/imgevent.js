const { MESSAGES } = require("../../utils/constants");
const { embedCreateFromEvent } = require("../../utils/functions");

module.exports.run = async (client, message, args) => {
  const { settings, channels } = client;
  const helpCmd = `
    Pour plus d'information sur la commande, tapes la commande \`${settings.prefix}help ${this.help.name}\``;
  if (!args[1])
    return message.reply(`L'URL de l'image n'a pas été saisie.${helpCmd}`);
  if (!args[1].match(client.config.REGEX.URL_IMG))
    return message.reply(`L'URL de l'image est mal saisie.${helpCmd}`);
  if (!args[0].match(client.config.REGEX.MESSAGE_ID))
    return message.reply(`L'ID est mal saisie.${helpCmd}`);
  let eventTarget = await client.getEvent({ messageID: args[0] });
  if (eventTarget) {
    eventTarget = await client.updateEvent(eventTarget, {
      image: args[1],
    });
    const evtChannel = await channels.fetch(settings.eventChannel);
    const originalMsg = await evtChannel.messages.fetch(eventTarget.messageID);
    const embed = embedCreateFromEvent(client, originalMsg, eventTarget);
    originalMsg.edit(embed);
    message.reply(
      `L'illustration de l'évènement \`${eventTarget.messageID}\` a été mis à jour.`
    );
  } else {
    return message.reply(`ID invalide.${helpCmd}`);
  }
};

module.exports.help = MESSAGES.COMMANDS.EVENT.IMGEVENT;
