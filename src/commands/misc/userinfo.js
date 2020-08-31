const { MESSAGES } = require("../../utils/constants");

module.exports.run = (client, message, args) => {
  const user_mention = message.mentions.users.first();
  const feedback = user_mention
    ? `Voici le tag de la personne mentionné : ${user_mention.tag}`
    : "Tu n'as tag personne :(";
  message.channel.send(feedback);
};

module.exports.help = MESSAGES.COMMANDS.MISC.USERINFO;
