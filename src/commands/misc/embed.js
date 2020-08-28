const { MessageEmbed } = require("discord.js");

module.exports.run = (client, message, args) => {
  const embed = new MessageEmbed()
    .setColor("#dc143c")
    .setTitle("Titre de l'embed")
    .setURL("https://www.google.com/")
    .setDescription("Description de l'embed")
    .setThumbnail(client.user.displayAvatarURL())
    .addField("Je suis un champ", "je suis sa valeur", true)
    .addFields(
      {
        name: "je suis le champ 1",
        value: "et je suis sa valeur, je suis aligné",
        inline: true,
      },
      {
        name: "je suis le champ 2",
        value: "et je suis une autre valeur",
        inline: false,
      }
    )
    .setImage(client.user.displayAvatarURL())
    .setTimestamp()
    .setFooter("le footer de l'embed");

  message.channel.send(embed);
};

module.exports.help = {
  name: "embed",
  aliases: ["embed"],
  description: "Renvoie un embed.",
  args: false,
  category: "misc",
};
