const { MESSAGES } = require("../../utils/constants");
const {
  getFormatFromDate,
  embedCreateFromEvent,
} = require("../../utils/functions");
const { MessageCollector } = require("discord.js");
const timeInterface = require("../../utils/timeInterface");
const { logAction } = require("../../utils/botlog");

module.exports.run = (client, message, args) => {
  const guildConfig = client.guildsConfig.get(message.guild.id);
  const { channel } = message;
  const helpCmd = `
Pour plus d'information sur la commande, tapes la commande \`${guildConfig.prefix}help ${this.help.name}\``;
  const nowFormat = getFormatFromDate(new Date());
  const dateFormatShowExample = `Merci de respecter ce format de saisie : ***\`${
    client.config.RDV_FORMAT
  }\`***\n  Exemple : \`${nowFormat}\` pour le \`${timeInterface(
    nowFormat,
    "DDMMYYYY HH mm"
  ).format("LLLL")}\``;

  const recordEvent = async function (newEvent) {
    channel.send("J'enregistre l'évènement...");
    const evt = await client.createEvent(newEvent, channel);
    if (evt) {
      // creation of the embed msg for event channel
      const evtEmbed = embedCreateFromEvent(client, message, evt);

      //send embed to event channel
      const eventChannel = await client.channels.cache.get(
        guildConfig.eventChannel
      );

      let urlEmbedMsg = "";
      await eventChannel.send(evtEmbed).then(async (msg) => {
        urlEmbedMsg = msg.url;
        // enregistrement du message et son url dans l'evenement en BD
        await client.updateEvent(evt, {
          messageLink: urlEmbedMsg,
          messageID: msg.id,
        });
        msg.pin({ reason: "nouvel évènement" });
        await eventChannel.send(
          `🤖 @here un nouvel évènement vient juste d'être posté 😃. N'hésitez pas à vous inscrire Bee-boop ! 🤖\n*Pour soutenir mon créateur, et améliorer mes performances :* **${process.env.TIPEEE_PAGE}**`
        );
      });
      message.reply(
        `Le message d'inscription a été créé, épinglé et est disponible ici : ${urlEmbedMsg}\nN'oublie pas de t'y inscrire en ajoutant une réaction 😜.`
      );
      logAction(
        client,
        message,
        MESSAGES.COMMANDS.EVENT.ADDEVENT,
        `Evènement créé.\nURL : ${urlEmbedMsg}`
      );
    }
  };

  const addEventNoTemplate = async function () {
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
        return message.reply(
          "il manque des informations valides pour poursuivre la création de l'évènement."
        );
      } else {
        // date management
        let rdv = timeInterface(
          rdvArgs.slice(0, 3).join(),
          "DDMMYYYYHHmm"
        ).toJSON();
        if (rdv !== null && timeInterface(rdv).isAfter(Date.now())) {
          try {
            await recordEvent({
              ...newEvent,
              rdv,
              description: rdvArgs.slice(3).join(" "),
            });
          } catch (error) {
            message.reply("erreur lors de l'enregistrement de l'évènement.");
            logAction(
              client,
              message,
              this.help,
              `Erreur de la base de donnée :\n${error.message}`
            );
          }
          botIsWaitingForFeedback = false;
          collector.stop();
        } else {
          message.reply(
            `le temps indiqué n'est pas valide ou dépassé.\n${dateFormatShowExample}\nTu peux également ajouter sur la même ligne que la date, une description de l'évènement.\nTapes ***\`stop\`*** pour ***annuler la commande***`
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
  const addEventWithTemplate = async function () {
    const templateName = args[0].substr(1);
    if (args.slice(1).length < 3) {
      return channel.send(
        "Le format du rendez-vous n'est pas respecté. Commande annulée."
      );
    }
    const rdv = timeInterface(args.slice(1).join(), "DDMMYYYYHHmm").toJSON();
    //check if the template name exist in DB
    const templateFromDB = await client.getTemplateByName(
      templateName,
      message.guild.id
    );
    //check rdv format and validation

    if (templateFromDB === null) {
      return message.reply(`Le modèle \`${templateName}\` n'existe pas.
Consultes la liste des modèles par la commande \`${guildConfig.prefix}eventtemplate list\`.`);
    }
    if (rdv !== null && timeInterface(rdv).isAfter(Date.now())) {
      try {
        await recordEvent({
          title: templateFromDB.title,
          creator: message.author.id,
          guildID: message.guild.id,
          image: templateFromDB.image,
          description: templateFromDB.description,
          rdv,
        });
      } catch (error) {
        message.reply("erreur lors de l'enregistrement de l'évènement.");
        logAction(
          client,
          message,
          this.help,
          `Erreur de la base de donnée :\n${error.message}`
        );
      }
    } else {
      message.reply(
        `le temps indiqué n'est pas valide ou dépassé.\n${dateFormatShowExample}`
      );
    }
  };

  //case addevent with no template
  if (args[0].startsWith('"')) {
    addEventNoTemplate();
  } else if (args[0].startsWith("!")) {
    addEventWithTemplate();
  } else {
    return message.reply(
      `L'argument du titre ne respecte pas le format attendu:
      - il n'est pas entouré des caractères \`"\` pour la création d'un évènement à la volée. Exemple : \`"Roi Moogle (extrème)"\`
      - ou n'est pas du format : \`!<nom_du_modèle>\` pour utiliser un modèle. Exemple : \`!roi_moogle_extrème\`, la liste des modèles est consultable avec la commande \`eventtemplate list\`${helpCmd}`
    );
  }
};

module.exports.help = MESSAGES.COMMANDS.EVENT.ADDEVENT;
