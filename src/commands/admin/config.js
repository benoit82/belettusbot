const { MESSAGES } = require("../../utils/constants");
const { saveChannel } = require("../../utils/functions");
module.exports.run = async (client, message, args) => {
  const { settings } = client;
  const getSetting = args[0];
  const newSetting = args.slice(1).join(" ");
  if (getSetting.match(client.config.REGEX.CHANNELS)) {
    await saveChannel(client, message, args, newSetting);
  }
  if (getSetting === "prefix") {
    if (newSetting) {
      await client.updateGuild(message.guild, { prefix: newSetting });
      client.settings = await client.getGuild(message.guild);
      return message.channel.send(
        `Prefix mis à jour: \`${settings.prefix}\` => \`${newSetting}\``
      );
    }
    message.channel.send("`" + settings.prefix + "`");
  }
  if (getSetting === "react") {
    if (args[1] && args[1] === "reset") {
      client.config.LIST_ROLE.forEach(async (role) => {
        client.settings.reactRoles[role] = [];
      });
      client.updateGuild(message.guild, {
        reactRoles: client.settings.reactRoles,
      });
      message.channel.send("Les réactions de rôles ont été éffacé.");
      return;
    }
    client.config.LIST_ROLE.forEach(async (role) => {
      const msg = await message.channel.send(role);
      if (!client.settings.reactRoles[role])
        client.settings.reactRoles[role] = [];
      if (client.settings.reactRoles[role].length > 0) {
        client.settings.reactRoles[role].forEach((emoji) => {
          msg.react(emoji);
        });
      }
      const filter = (reaction, user) => {
        return user.id === user.id;
      };
      const msgReactCollector = msg.createReactionCollector(filter, {
        idle: 90_000,
      });
      msgReactCollector.on("collect", (reaction) => {
        let reac = reaction.emoji.id
          ? reaction.emoji.id
          : reaction.emoji.toString();
        if (!client.settings.reactRoles[role].includes(reac)) {
          client.settings.reactRoles[role].push(reac);
        }
      });
      msgReactCollector.on("remove", (reaction) => {
        let reac = reaction.emoji.id
          ? reaction.emoji.id
          : reaction.emoji.toString();
        client.settings.reactRoles[role].filter((emoji) => emoji !== reac);
        console.log("- " + reaction);
      });
      msgReactCollector.on("end", async () => {
        await client.updateGuild(message.guild, {
          reactRoles: client.settings.reactRoles,
        });
        msg.delete();
        message.channel
          .send("réaction `" + role + "` sauvegardé.")
          .then((msg) => {
            setTimeout(() => {
              msg.delete();
            }, 3_000);
          });
      });
    });
  }
};

module.exports.help = MESSAGES.COMMANDS.ADMIN.CONFIG;
