module.exports.run = (client, message, args) => {
  const user_mention = message.mentions.users.first() || message.author;
  message.channel.send(
    `Voici le tag de la personne mentionné : ${user_mention.tag}`
  );
};

module.exports.help = {
  name: "userinfo",
  aliases: ["userinfo", "ui"],
  description: "Renvoie les informatins d'un utilisateur mentionné.",
  args: true,
  usage: "<@utilisateur>",
  cooldown: 10_000,
};
