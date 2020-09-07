const { MESSAGES } = require("../../utils/constants");
const { saveChannel } = require("../../utils/functions");
module.exports.run = async (client, message, args) => {
  const guildConfig = client.guildsConfig.get(message.guild.id);
  const getSetting = args[0];
  const newSetting = args.slice(1).join(" ");
  const addReact = async (role) => {
    const msg = await message.channel.send(role);
    if (!guildConfig.reactRoles[role]) guildConfig.reactRoles[role] = [];
    if (guildConfig.reactRoles[role].length > 0) {
      guildConfig.reactRoles[role].forEach((emoji) => {
        msg.react(emoji);
      });
    }
    const filter = (reaction, user) => {
      return message.guild.roles.highest.members.has(user.id);
    };
    const msgReactCollector = msg.createReactionCollector(filter, {
      idle: 30000,
    });
    msgReactCollector.on("collect", (reaction) => {
      let reac = reaction.emoji.id
        ? reaction.emoji.id
        : reaction.emoji.toString();
      if (!guildConfig.reactRoles[role].includes(reac)) {
        guildConfig.reactRoles[role].push(reac);
      }
    });

    msgReactCollector.on("end", async () => {
      await client.updateGuild(message.guild, {
        reactRoles: guildConfig.reactRoles,
      });
      msg.delete();
      message.channel
        .send("réaction `" + role + "` sauvegardé.")
        .then((msg) => {
          setTimeout(() => {
            msg.delete();
          }, 3000);
        });
    });
  };

  if (getSetting.match(client.config.REGEX.CHANNELS)) {
    await saveChannel(client, message, args, newSetting);
  }
  if (getSetting === "prefix") {
    if (newSetting) {
      await client.updateGuild(message.guild, { prefix: newSetting });
      return message.channel.send(
        `Prefix mis à jour: \`${guildConfig.prefix}\` => \`${newSetting}\``
      );
    }
    message.channel.send("`" + guildConfig.prefix + "`");
  }
  if (getSetting === "react") {
    if (args[1] && args[1] === "reset") {
      const isRoleInputed =
        args[2] && client.config.LIST_ROLE.includes(args[2]);
      if (isRoleInputed) {
        guildConfig.reactRoles[args[2]] = [];
      } else {
        client.config.LIST_ROLE.forEach(async (role) => {
          guildConfig.reactRoles[role] = [];
        });
      }
      client.updateGuild(message.guild, {
        reactRoles: guildConfig.reactRoles,
      });
      const confMsg = isRoleInputed
        ? `Les réactions du rôle \`${args[2]}\` ont été éffacé.`
        : "Les réactions de rôles ont été éffacé.";
      message.channel.send(confMsg);
      return;
    }
    if (args[1] && client.config.LIST_ROLE.includes(args[1])) {
      addReact(args[1]);
    }
  }
};

module.exports.help = MESSAGES.COMMANDS.ADMIN.CONFIG;
