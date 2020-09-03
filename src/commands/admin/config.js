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
};

module.exports.help = MESSAGES.COMMANDS.ADMIN.CONFIG;
