const { MESSAGES } = require("../../utils/constants");
module.exports.run = async (client, message, args) => {
  const { settings } = client;
  const getSetting = args[0];
  const newSetting = args.slice(1).join(" ");
  switch (getSetting) {
    case "logChannel":
      if (newSetting) {
        await client.updateGuild(message.guild, {
          logChannel: newSetting,
        });
        return message.channel.send(
          `Log Channel mis à jour: \`${settings.logChannel}\` => \`${newSetting}\``
        );
      }
      return message.channel.send("`" + settings.logChannel + "`");
      break;
    case "prefix":
      if (newSetting) {
        await client.updateGuild(message.guild, { prefix: newSetting });
        return message.channel.send(
          `Prefix mis à jour: \`${settings.prefix}\` => \`${newSetting}\``
        );
      }
      return message.channel.send("`" + settings.prefix + "`");
      break;
    default:
      return;
      break;
  }
};

module.exports.help = MESSAGES.COMMANDS.ADMIN.CONFIG;
