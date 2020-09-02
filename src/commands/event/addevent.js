const { MESSAGES } = require("../../utils/constants");
const { getFormatFromDate } = require("../../utils/functions");
const moment = require("moment");
const { MessageCollector } = require("discord.js");

module.exports.run = (client, message, args) => {
  //client.channels.cache.find("name", "évents").send("coucou");
  const { channel } = message;
  const helpCmd = `
Pour plus d'information sur la commande, tapes la commande \`${client.settings.prefix}help ${this.help.name}\``;
  const nowFormat = getFormatFromDate(new Date());
  const dateFormatShowExample = `Merci de respecter ce format de saisie :\n-***\`JJMMAAAA HH mm (<description de l'évènement>) optionnel\`***\n  Exemple : \`${nowFormat}\` pour le \`${moment(
    nowFormat,
    "DDMMYYYY HH mm"
  ).format("LLLL")}\` \n-***\`stop\`*** pour ***annuler la commande***`;
  if (!args[0].startsWith('"'))
    return message.reply(
      `L'argument du titre n'est pas entouré des caractères \`"\`, retapes la commande.${helpCmd}`
    );
  const step1args = args.join(" ").split('"').slice(1);
  if (
    step1args[1] &&
    !step1args[1]
      .trim()
      .match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/)
  )
    return channel.send(
      `L'argument de l'URL de l'image n'est pas valide, retapes la commande.${helpCmd}`
    );
  const image =
    step1args[1] || "https://www.fffury.com/FF9/Images/Chocobos/Chocobos-1.png";
  let newEvent = {
    title: step1args[0],
    image,
    creator: message.author.id,
    guildID: message.guild.id,
  };

  channel.send(`Date et heure du rendez-vous ? ${dateFormatShowExample}`);
  const collector = new MessageCollector(
    channel,
    (m) => m.author.id === message.author.id,
    { time: 120_000 } // 2mn
  );
  let botIsWaitingForFeedback = true;
  collector.on("collect", async (creatorMsg) => {
    const rdvArgs = creatorMsg.content.trim().split(/ +/);
    if (rdvArgs[0] === "stop") {
      botIsWaitingForFeedback = false;
      channel.send("-- Création d'un nouvel évènement : **Annulé** --");
      collector.stop();
      return;
    }
    if (rdvArgs.length < 3) {
      channel.send(
        "Il manque des informations valides pour poursuivre la création de l'évènement."
      );
    } else {
      // date management
      let rdv = moment(rdvArgs.slice(0, 2).join(), "DDMMYYYYHHmm").toJSON();
      if (rdv !== null && !moment(rdv).isBefore(Date.now())) {
        const description = rdvArgs.slice(3).join(" ");
        channel.send("J'enregistre l'évènement...");
        newEvent = { ...newEvent, rdv, description };
        if (await client.createEvent(newEvent, channel)) {
          message.reply(
            "N'oublie pas de t'y inscrire en ajoutant une réaction 😜."
          );
        }
        botIsWaitingForFeedback = false;
        collector.stop();
      } else {
        message.reply(
          `Le temps indiqué n'est pas valide ou dépassé.${dateFormatShowExample}`
        );
      }
    }
  });

  collector.on("end", (collected) => {
    if (botIsWaitingForFeedback)
      message.reply(
        "Fin d'attente de saisie. Recommences le processus de création."
      );
    return;
  });
};

module.exports.help = MESSAGES.COMMANDS.EVENT.ADDEVENT;
