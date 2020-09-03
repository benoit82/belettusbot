const { TYPE } = require("../config");

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
        ],
        typeInfoLog: TYPE.info.label,
        category: "admin",
        isUserAdmin: true,
      },
      EVAL: {
        name: "eval",
        aliases: ["eval"],
        description: "Renvoie un code javascript testé",
        cooldown: 3_000,
        usage: ["<code_to_test>"],
        args: true,
        typeInfoLog: TYPE.info.label,
        category: "admin",
        isUserAdmin: true,
      },
    },
    EVENT: {
      ADDEVENT: {
        name: "addevent",
        aliases: ["addevent"],
        description:
          "Ajoute un évènement pour la communauté, FFXIV ou autres... Même les soirées barbec'!",
        usage: ['"<titre>"', '"<titre>" <url illustration>'],
        args: true,
        typeInfoLog: TYPE.info.label,
        category: "event",
      },
      CLEAREVENTS: {
        name: "clearevents",
        aliases: ["clearevents"],
        description:
          "Purge la base de donnée des évents du serveur discord qui sont dépassé.",
        usage: [""],
        args: false,
        typeInfoLog: TYPE.danger.label,
        category: "event",
        isUserAdmin: true,
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
        category: "misc",
      },
      HELP: {
        name: "help",
        aliases: ["help"],
        description: "liste les commandes du bot",
        args: false,
        category: "misc",
        cooldown: 1_000,
        usage: ["<command_name>"],
      },
      TEST: {
        name: "test",
        aliases: ["test"],
        description: "Test validation de date.",
        args: false,
        usage: ["<JJMMAAAA HH mm>"],
        cooldown: 100,
        category: "misc",
      },
    },
  },
};

exports.MESSAGES = MESSAGES;
