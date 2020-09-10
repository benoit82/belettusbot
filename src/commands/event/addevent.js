const { MESSAGES } = require("../../utils/constants");
const {
  getFormatFromDate,
  embedCreateFromEvent,
} = require("../../utils/functions");
const { MessageCollector, MessageEmbed } = require("discord.js");
const moment = require("moment");
const { logAction } = require("../../utils/botlog");
moment.locale("fr");

module.exports.run = (client, message, args) => {
  const guildConfig = client.guildsConfig.get(message.guild.id);
  const { channel } = message;
  const helpCmd = `
Pour plus d'information sur la commande, tapes la commande \`${guildConfig.prefix}help ${this.help.name}\``;
  const nowFormat = getFormatFromDate(new Date());
  const dateFormatShowExample = `Merci de respecter ce format de saisie :\n-***\`${
    client.config.RDV_FORMAT
  }\`***\n-***\`${
    client.config.RDV_FORMAT
  } <description de l'évènement>\`***\n  Exemple : \`${nowFormat}\` pour le \`${moment(
    nowFormat,
    "DDMMYYYY HH mm"
  ).format("LLLL")}\` \n-***\`stop\`*** pour ***annuler la commande***`;

  if (!args[0].startsWith('"'))
    return message.reply(
      `L'argument du titre n'est pas entouré des caractères \`"\`, retapes la commande.${helpCmd}`
    );
  const step1args = args.join(" ").split('"').slice(1);
  if (step1args[1] && !step1args[1].trim().match(client.config.REGEX.URL_IMG))
    return channel.send(
      `L'argument de l'URL de l'image n'est pas valide, retapes la commande.${helpCmd}`
    );
  let newEvent = {
    title: step1args[0],
    creator: message.author.id,
    guildID: message.guild.id,
  };
  if (step1args[1]) newEvent.image = step1args[1];

  channel.send(`Date et heure du rendez-vous ? ${dateFormatShowExample}`);
  const collector = new MessageCollector(
    channel,
    (m) => m.author.id === message.author.id,
    { time: 120000 } // 2mn
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
      let rdv = moment(rdvArgs.slice(0, 3).join(), "DDMMYYYYHHmm").toJSON();
      if (rdv !== null && !moment(rdv).isBefore(Date.now())) {
        const description = rdvArgs.slice(3).join(" ");
        channel.send("J'enregistre l'évènement...");
        newEvent = { ...newEvent, rdv, description };
        const evt = await client.createEvent(newEvent, channel);
        if (evt) {
          // creation of the embed msg for event channel
          const evtEmbed = embedCreateFromEvent(client, message, evt);

          //send embed to event channel
          let urlEmbedMsg = "";
          const eventChannel = await client.channels.cache.get(
            guildConfig.eventChannel
          );
          eventChannel.send(evtEmbed).then(async (msg) => {
            urlEmbedMsg = msg.url;
            // enregistrement du message et son url dans l'evenement en BD
            await client.updateEvent(evt, {
              messageLink: urlEmbedMsg,
              messageID: msg.id,
            });
            msg.pin({ reason: "nouvel évènement" });
            await eventChannel.send(
              "🤖 @here un nouvel évènement vient juste d'être posté 😃. N'hésitez pas à vous inscrire Bee-boop ! 🤖"
            );
          });

          message.reply(
            `Le message d'inscription a été créé, épinglé et est disponible ici : ${urlEmbedMsg}\nN'oublie pas de t'y inscrire en ajoutant une réaction 😜.`
          );
          logAction(
            client,
            message,
            this.help,
            `Evènement créé.\nURL : ${urlEmbedMsg}`
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
