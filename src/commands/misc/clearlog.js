const { MESSAGES } = require("../../utils/constants");
const { MessageCollector } = require("discord.js");
const { logAction } = require("../../utils/botlog");

module.exports.run = async (client, message, args) => {
  const { PREFIX, TYPE } = client.config;
  if (args[0] === "all") {
    const time = 5000;
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
    logAction(client, this.help, "Canal de discution nétoyé.", message);
  }
};

module.exports.help = MESSAGES.COMMANDS.MISC.CLEARLOG;
