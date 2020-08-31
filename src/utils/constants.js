const { TYPE } = require("../config");

const MESSAGES = {
  COMMANDS: {
    MISC: {
      CLEARLOG: {
        name: "clearlog",
        aliases: ["clearlog"],
        description:
          "Nettoie le canal des commandes tapées et les réponses du bot.\nArgument optionel : `?clearlog all` pour effacer **TOUS** les messages du canal.",
        args: false,
        usage: "<'all'> (optionel)",
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
        usage: "<command_name>",
      },
      USERINFO: {
        name: "userinfo",
        aliases: ["userinfo", "ui"],
        description: "Renvoie les informatins d'un utilisateur mentionné.",
        args: true,
        usage: "<@utilisateur>",
        cooldown: 10_000,
        category: "misc",
      },
    },
  },
};

exports.MESSAGES = MESSAGES;
