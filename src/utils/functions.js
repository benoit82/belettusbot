const { MessageEmbed } = require("discord.js");
const moment = require("moment");
moment.locale("fr");

exports.getFormatFromDate = (date) => {
  const toFormat = (num) => {
    return num.toString().padStart(2, "0");
  };

  return (res =
    toFormat(date.getDate()) +
    toFormat(date.getMonth() + 1) +
    date.getFullYear() +
    " " +
    toFormat(date.getHours()) +
    " " +
    toFormat(date.getMinutes()));
};

exports.saveChannel = async (client, message, args, newSetting) => {
  const { settings } = client;
  if (!args[1]) {
    return message.channel.send(
      `\`#${client.channels.cache.get(settings[args[0]]).name}\``
    );
  }
  let res = {};
  if (newSetting.match(/^([0-9]*)$/)) {
    res = client.channels.cache.get(newSetting);
    if (res) {
      await client.updateGuild(message.guild, { [args[0]]: res.id });
    } else {
      message.channel.send(
        `Salon non trouvé. Vérifies la donnée : \`${newSetting}\`.`
      );
      return;
    }
  } else {
    res = client.channels.cache.find(
      (channel) =>
        channel.name === newSetting && channel.guild.id === message.guild.id
    );
    if (res) {
      await client.updateGuild(message.guild, { [args[0]]: res.id });
    } else {
      message.channel.send(
        `Salon non trouvé. Vérifies la donnée : \`${newSetting}\`.`
      );
      return;
    }
  }
  return message.channel.send(
    `${args[0]} mis à jour du salon : \`#${
      client.channels.cache.get(settings[args[0]]).name
    }\` => \`#${res.name}\``
  );
};

exports.embedCreateFromEvent = (client, message, event) => {
  const me = new MessageEmbed()
    .setAuthor(message.author.username, message.author.avatarURL())
    .setColor(
      event.isActive
        ? client.config.TYPE.info.color
        : client.config.TYPE.danger.color
    )
    .setTitle(event.title)
    .addField(
      "`Status` : ",
      event.isActive ? "**INSCRIPTIONS OUVERTES**" : "**ANNULEE**"
    )
    .addField(
      "`Heure du rendez-vous` : ",
      `**${moment(event.rdv).format("LLLL")}**`
    )
    .addField("`Joueurs` : ", `**${event.players}**`)
    .setTimestamp();

  if (event.image && event.image !== "") {
    me.setImage(event.image);
  } else {
    me.setThumbnail(
      "https://www.fffury.com/FF9/Images/Chocobos/Chocobos-1.png"
    );
  }
  if (event.description && event.description !== "")
    me.setDescription("`Description` : ", event.description);

  return me;
};
