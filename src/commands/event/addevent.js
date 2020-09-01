const { MESSAGES } = require("../../utils/constants");
const moment = require("moment");
const { MessageCollector } = require("discord.js");

module.exports.run = (client, message, args) => {
  const { channel } = message;
  if (!args[0].startsWith('"'))
    return channel.send(
      "L'argument du titre n'est pas entouré des caractères `\"`, retapes la commande."
    );
  const step1args = args.join(" ").split('"').slice(1);
  if (
    step1args[1] &&
    !step1args[1].trim().match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/)
  )
    return channel.send(
      "L'argument de l'URL de l'image n'est pas valide, retapes la commande."
    );
  const image =
    step1args[1] || "https://www.fffury.com/FF9/Images/Chocobos/Chocobos-1.png";
  let newEvent = {
    title: step1args[0],
    image,
    creator: message.author.id,
    guildID: message.guild.id,
  };
  channel.send(
    "Date et heure du rendez-vous ?\nMerci de respecter ce format de saisie : ***`JJMMAAAA HH MM (<description de l'évènement>) optionnel`***\nExemple : `01092020 21 00` pour le `1er septembre 2020 à 21h00`"
  );
  const collector = new MessageCollector(
    channel,
    (m) => m.author.id === message.author.id,
    { time: 5 * 60 * 1000 }
  );

  collector.on("collect", async (creatorMsg) => {
    const rdvArgs = creatorMsg.content.trim().split(/ +/);
    if (rdvArgs.length < 3) {
      channel.send(
        "Il manque des informations valides pour poursuivre la création de l'évènement."
      );
    } else {
      // date management
      const rdv = moment(rdvArgs.slice(0, 2).join(), "DDMMYYYYHHmm").toJSON();
      const description = rdvArgs.slice(3).join(" ");
      channel.send("J'enregistre l'évènement...");
      newEvent = { ...newEvent, rdv, description };
      await client.createEvent(newEvent, channel);
      channel.send("N'oublie pas de t'y inscrire en ajoutant une réaction 😜.");
      collector.stop();
    }
  });
};

module.exports.help = MESSAGES.COMMANDS.EVENT.ADDEVENT;
