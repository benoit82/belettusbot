const { MESSAGES } = require("../../utils/constants");
const { REGEX } = require("../../config");
const { MessageCollector, Collector } = require("discord.js");

module.exports.run = async (client, message, args) => {
  const manegeTemplate = async function (settings, action) {
    const name = args[1];
    const title = settings.split(/"/gi)[1];
    const description = settings.split(/"/gi)[3] || "";
    const image = args.find((url) => url.match(REGEX.URL_IMG)) || "";
    if (!name || !title) {
      return message.reply(
        "Il faut respecter la syntaxe de la commande.\nVérifies si le nom du pattern est en un seul mot et si le titre est bien entre 2 doubles quotes `\"\"`.\nL'URL de l'illustration est optionnel."
      );
    } else {
      const tmplFromDB = await client.getTemplateByName(name);
      if (action === "create" && tmplFromDB !== null) {
        return message.reply(
          "Un modèle porte déjà ce nom, consultes la liste avec la commande `list`, puis recommances."
        );
      }
      if (action === "update" && tmplFromDB === null) {
        return message.reply("Erreur : aucun modèle n'a ce nom.");
      }
      message.reply(
        `Résumons les informations ensemble :
            nom du modèle : ${name}
            Titre évènement : ${title}
            Description : ${description}
            URL de l'illustration : ${image}
            Réponds \`oui\` pour valider, ou réponds par autre chose pour annuler. (30 secondes d'attente avant annulation de la commande)`
      );
      const msgCollector = new MessageCollector(
        message.channel,
        (m) => m.author.id === message.author.id,
        { max: 1, time: 30000 }
      );
      msgCollector.on("collect", async (usermsg) => {
        if (usermsg.content.trim().toLowerCase().startsWith("oui")) {
          const newTmpl = {
            name,
            title,
            image,
            description,
            creator: message.author.id,
          };
          switch (action) {
            case "create":
              await client.createTemplate(newTmpl, message.channel);
              break;
            case "update":
              await client.updateTemplate(tmplFromDB, newTmpl);
              message.reply("Modèle mis à jour !");
              break;
            default:
              break;
          }
        }
        msgCollector.stop();
      });

      msgCollector.on("end", (collected, reason) => {
        if (reason === "time")
          return message.reply(
            "Le temps de réponse est écoulé. Commande stoppée."
          );
      });
    }
  };
  const displayList = async function (lang) {
    const templates = await client.getTemplates(lang);
    if (templates.length === 0) {
      message.reply("il n'y a aucun modèle actuellement");
    } else {
      let msgBuilder = "la liste des modèles d'évènements :\n";
      templates.forEach((tmpl) => {
        msgBuilder += "`" + tmpl.name + "` : " + tmpl.title + "\n";
      });
      message.reply(msgBuilder);
    }
  };

  if (args[0]) {
    const settings = args.slice(1).join(" ");
    switch (args[0]) {
      case "create":
        manegeTemplate(settings, args[0]);
        break;
      case "update":
        manegeTemplate(settings, args[0]);
        break;
      case "delete":
        if (args[1]) {
          const deleted = await client.deleteTemplate(args[1]);
          const conf = deleted ? "modèle supprimé" : "modèle non trouvé";
          message.reply(conf);
        } else {
          message.reply("Argument de commande manquante.");
        }
        break;
      case "list":
        displayList("fr");
        break;
      default:
        return message.reply("Commande non reconnu.");
        break;
    }
  }
};

module.exports.help = MESSAGES.COMMANDS.EVENT.EVENTTEMPLATE;
