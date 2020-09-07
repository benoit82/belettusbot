require("dotenv").config();
const { Collection } = require("discord.js");
const { CD_COMMAND_DEFAULT } = require("../../config");

module.exports = async (client, message) => {
  if (message.author.bot) return;
  const guildConfig = client.guildsConfig.get(message.guild.id);
  if (!message.content.startsWith(guildConfig.prefix)) return;
  if (message.channel.type === "dm")
    return client.emit("directMessage", message);

  const args = message.content
    .trim()
    .slice(guildConfig.prefix.length)
    .split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.help.aliases && cmd.help.aliases.includes(commandName)
    );
  if (!command) return;

  // check user restriction
  if (
    command.help.isUserAdmin &&
    !message.guild.roles.highest.members.has(message.member.id)
  )
    return message.channel.send(
      `Le rôle \`${message.guild.roles.highest.name}\` est nécéssaire pour utiliser cette commande.`
    );

  // check if event channel has been configure for eventCmd
  if (guildConfig.eventChannel === "" && commandName.match(/(addevent|ae)/))
    return message.channel.send(
      "Il faut configurer le salon d'annonce des évènements en premier lieu, par la commande `config`.\nIl faut les droit administrateur du serveur pour l'utiliser.\nConsulte la commande `help` pour plus d'information."
    );

  // args checker
  if (command.help.args && !args.length) {
    let noArgsReply = `Il faut des arguments pour cette commande, ${message.author}.`;
    if (command.help.usage)
      noArgsReply += "\nVoici comment utiliser la commande :";
    command.help.usage.forEach((u) => {
      noArgsReply += `\n \`${guildConfig.prefix}${command.help.name} ${u}\``;
    });
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
      const timeLeft = (cdExpirationTime - timeNow) / 1000;
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
