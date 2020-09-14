const { TYPE, RDV_FORMAT } = require("../config");

const MESSAGES = {
  COMMANDS: {
    ADMIN: {
      CONFIG: {
        name: "config",
        aliases: ["config"],
        description: "configuration du bot pour le serveur discord",
        args: true,
        usage: [
          "logChannel <id_du_salon | nom_du_salon (sans le #)>",
          "eventChannel <id_du_salon | nom_du_salon (sans le #)>",
          "prefix <valeur>",
          "react <Tanks | Healers | DPS | Flex>",
          "react reset",
          "react reset <Tanks | Healers | DPS | Flex>",
        ],
        typeInfoLog: TYPE.info.label,
        category: "admin",
        isUserAdmin: true,
      },
    },
    EVENT: {
      ADDEVENT: {
        name: "addevent",
        aliases: ["addevent", "ae"],
        description:
          "Ajoute un évènement pour la communauté, FFXIV ou autres... Même les soirées barbec'!",
        usage: ['"<titre>"', '"<titre>" <url illustration>', "!<nom_modèle>"],
        args: true,
        typeInfoLog: TYPE.info.label,
        isUserAdmin: false,
        category: "event",
      },
      CANCELEVENT: {
        name: "cancelevent",
        aliases: ["cancelevent", "ce"],
        description:
          "Annule un évènement par rapport à son ID. On peux obtenir l'ID d'un évènement via la commande `myevents`",
        usage: ["<ID_evenement>"],
        args: true,
        typeInfoLog: TYPE.danger.label,
        isUserAdmin: false,
        category: "event",
      },
      CLEAREVENTS: {
        name: "clearevents",
        aliases: ["clearevents", "xe"],
        description:
          "Purge la base de donnée des évents du serveur discord qui sont dépassé.",
        usage: [""],
        args: false,
        typeInfoLog: TYPE.danger.label,
        category: "event",
        isUserAdmin: true,
      },
      EVENTTEMPLATE: {
        name: "eventtemplate",
        aliases: ["eventtemplate", "et"],
        description: "Gestion des modèles d'évènement.",
        usage: [
          "list",
          'create <nom> <"titre"> <URL_image (optionnel)> <"description" (optionnel)>',
          'update <nom> <"titre"> <URL_image (optionnel)> <"description" (optionnel)>',
          "delete <nom>",
        ],
        args: true,
        isUserAdmin: false,
        typeInfoLog: TYPE.info.label,
        category: "event",
      },
      IMGEVENT: {
        name: "imgevent",
        aliases: ["imgevent", "ie"],
        description:
          "Modifie l'image d'illustration d'un évènement. On peux obtenir l'ID d'un évènement via la commande `myevents`",
        usage: ["<ID_evenement> <URL_image>"],
        args: true,
        isUserAdmin: false,
        typeInfoLog: TYPE.info.label,
        category: "event",
      },
      MYEVENTS: {
        name: "myevents",
        aliases: ["myevents", "me"],
        description:
          "Affiche les différents évènement créer par l'utilisateur, afin de pouvoir annuler un évènement.",
        usage: [""],
        args: false,
        typeInfoLog: TYPE.info.label,
        isUserAdmin: false,
        category: "event",
      },
      NEXTEVENTS: {
        name: "nextevents",
        aliases: ["nextevents", "next", "ne"],
        description:
          "Affiche une liste des prochains évènements encore prévu avec le lien pour s'inscrire/désinscrire. Par défault, la liste affiche les évènements sur les 7 prochains jours",
        usage: ["", "<nombre de jours>"],
        args: false,
        typeInfoLog: TYPE.info.label,
        isUserAdmin: false,
        category: "event",
      },
    },
    MISC: {
      CLEARLOG: {
        name: "clearlog",
        aliases: ["clearlog"],
        description:
          "Nettoie le canal des commandes tapées et les réponses du bot.\nArgument optionel : `?clearlog all` pour effacer **TOUS** les messages du canal depuis la connection du bot.",
        args: false,
        usage: ["", "all"],
        typeInfoLog: TYPE.warning.label,
        isUserAdmin: true,
        category: "misc",
      },
      HELP: {
        name: "help",
        aliases: ["help"],
        description: "liste les commandes du bot",
        args: false,
        category: "misc",
        cooldown: 1000,
        usage: ["<command_name>"],
        isUserAdmin: false,
      },
      TEST: {
        name: "test",
        aliases: ["test"],
        description: "Test validation de date.",
        args: false,
        usage: [`<${RDV_FORMAT}>`],
        cooldown: 100,
        category: "misc",
        isUserAdmin: true,
      },
    },
  },
};

exports.MESSAGES = MESSAGES;
