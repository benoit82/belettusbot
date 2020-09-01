const { TYPE } = require("../config");

const MESSAGES = {
  COMMANDS: {
    ADMIN: {
      CONFIG: {
        name: "config",
        aliases: ["config"],
        description: "configuration du bot pour le serveur discord",
        args: true,
        usage: "<key_to_update> <value>",
        typeInfoLog: TYPE.info.label,
        category: "admin",
        isUserAdmin: true,
      },
      EVAL: {
        name: "eval",
        aliases: ["eval"],
        description: "Renvoie un code javascript testé",
        cooldown: 3_000,
        usage: "<code_to_test>",
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
        description: "Ajoute un évènement pour la communauté (FFXIV ou autre)",
        usage: '"<titre>" (<url illustration>) optionnel',
        args: true,
        typeInfoLog: TYPE.info.label,
        category: "event",
      },
    },
    MISC: {
      CLEARLOG: {
        name: "clearlog",
        aliases: ["clearlog"],
        description:
          "Nettoie le canal des commandes tapées et les réponses du bot.\nArgument optionel : `?clearlog all` pour effacer **TOUS** les messages du canal.",
        args: false,
        usage: "all (optionel)",
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