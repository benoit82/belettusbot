const { PREFIX, TYPE } = require("../../config");
const { MessageCollector } = require("discord.js");
const { logAction } = require("../../utils/botlog");

module.exports.run = async (client, message, args) => {
  if (args[0] === "all") {
    const time = 5_000;
    const collector = new MessageCollector(
      message.channel,
      (m) => m.author.id === message.author.id,
      { time }
    );
    const cancelCmdConfirm = setTimeout(() => {
      message.reply("Commande annulée");
    }, time);

    // confirm before clean all channel messages
    message.reply(
      `Es-tu certain de vouloir supprimer tous les messages du salon ?
Réponds par \`oui\` sous ${
        time / 1000
      } secondes pour valider, sinon la commande sera annulée.`
    );

    collector.on("collect", async (msg) => {
      if (msg.content === "oui") {
        const messages = await message.channel.messages.fetch();
        await message.channel.bulkDelete(messages, true);
        this.help.typeInfoLog = TYPE.danger.label;
        logAction(
          client,
          message,
          this.help,
          "Canal de discution totalement purgé."
        );
        clearTimeout(cancelCmdConfirm);
      }
    });
  } else {
    const messages = await message.channel.messages.fetch();
    await messages.forEach((message) => {
      if (message.content.startsWith(PREFIX) || message.author.bot)
        message.delete();
    });
    logAction(client, message, this.help, "Canal de discution nétoyé.");
  }
};

module.exports.help = {
  name: "clearlog",
  aliases: ["clearlog"],
  description:
    "Nettoie le canal des commandes tapées et les réponses du bot.\nArgument optionel : `?clearlog all` pour effacer **TOUS** les messages du canal.",
  args: false,
  typeInfoLog: TYPE.warning.label,
  category: "misc",
};
