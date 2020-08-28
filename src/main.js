const { Client, Collection, Message } = require("discord.js");
const { PREFIX, CD_COMMAND_DEFAULT } = require("./config");
const { readdirSync } = require("fs");
require("dotenv").config();

const client = new Client();
["commands", "cooldowns"].forEach((x) => (client[x] = new Collection()));

// load commands from commands folders
const loadCommands = (dir = "src/commands") => {
  readdirSync(dir).forEach((fold) => {
    const commands = readdirSync(`${dir}/${fold}`).filter((file) =>
      file.endsWith(".js")
    );

    for (const file of commands) {
      const getFileName = require(`./commands/${fold}/${file}`);
      client.commands.set(getFileName.help.name, getFileName);
      console.log(`Commande chargée : ${getFileName.help.name}`);
    }
  });
};
loadCommands();

// event listeners
client.on("message", (msg) => {
  if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;
  const args = msg.content.trim().slice(PREFIX.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.help.aliases && cmd.help.aliases.includes(commandName)
    );
  if (!command) return;

  // args checker
  if (command.help.args && !args.length) {
    let noArgsReply = `Il faut des arguments pour cette commande, ${msg.author}.`;
    if (command.help.usage)
      noArgsReply += `\nVoici comment utiliser la commande : \`${PREFIX}${command.help.name} ${command.help.usage}\``;
    return msg.channel.send(noArgsReply);
  }

  // cooldown management
  if (!client.cooldowns.has(command.help.name)) {
    client.cooldowns.set(command.help.name, new Collection());
  }
  const timeNow = Date.now();
  const tStamps = client.cooldowns.get(command.help.name);
  const cdAmount = command.help.cooldown || CD_COMMAND_DEFAULT;

  if (tStamps.has(msg.author.id)) {
    const cdExpirationTime = tStamps.get(msg.author.id) + cdAmount;
    if (timeNow < cdExpirationTime) {
      const timeLeft = (cdExpirationTime - timeNow) / 1_000;
      return msg.reply(
        `merci d'attendre ${timeLeft.toFixed(
          0
        )} seconde(s) avant de ré-utiliser la commande \`${
          command.help.name
        }\`.`
      );
    }
  }
  tStamps.set(msg.author.id, timeNow);
  setTimeout(() => tStamps.delete(msg.author.id), cdAmount);

  // finally, run the command
  command.run(client, msg, args);
});

client.on("ready", () => console.log(`Logged in as ${client.user.tag}!`));

// log the bot
client.login(process.env.DISCORD_BOT_TOKEN);
