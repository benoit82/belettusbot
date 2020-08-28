const { Collection } = require("discord.js");
const { PREFIX, CD_COMMAND_DEFAULT } = require("../../config");

module.exports = (client, message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;
  const args = message.content.trim().slice(PREFIX.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.help.aliases && cmd.help.aliases.includes(commandName)
    );
  if (!command) return;

  // args checker
  if (command.help.args && !args.length) {
    let noArgsReply = `Il faut des arguments pour cette commande, ${message.author}.`;
    if (command.help.usage)
      noArgsReply += `\nVoici comment utiliser la commande : \`${PREFIX}${command.help.name} ${command.help.usage}\``;
    return message.channel.send(noArgsReply);
  }

  // cooldown management
  if (!client.cooldowns.has(command.help.name)) {
    client.cooldowns.set(command.help.name, new Collection());
  }
  const timeNow = Date.now();
  const tStamps = client.cooldowns.get(command.help.name);
  const cdAmount = command.help.cooldown || CD_COMMAND_DEFAULT;

  if (tStamps.has(message.author.id)) {
    const cdExpirationTime = tStamps.get(message.author.id) + cdAmount;
    if (timeNow < cdExpirationTime) {
      const timeLeft = (cdExpirationTime - timeNow) / 1_000;
      return message.reply(
        `merci d'attendre ${timeLeft.toFixed(
          0
        )} seconde(s) avant de ré-utiliser la commande \`${
          command.help.name
        }\`.`
      );
    }
  }
  tStamps.set(message.author.id, timeNow);
  setTimeout(() => tStamps.delete(message.author.id), cdAmount);

  // finally, run the command
  command.run(client, message, args);
};
