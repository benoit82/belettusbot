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
  client.settings = await client.getGuild(message.guild);
  return message.channel.send(
    `${args[0]} mis à jour du salon : \`#${
      client.channels.cache.get(settings[args[0]]).name
    }\` => \`#${res.name}\``
  );
};

exports.embedCreateFromEvent = (client, message, event) => {
  const playerFieldSeparator = ", ";
  const author = message.channel.members.find(
    (member) => member.id === event.creator
  ).user;
  let players = "";
  let setPlayers = new Set(event.players);
  setPlayers.forEach((pID) => {
    players +=
      message.channel.guild.members.cache.find(
        (member) => member.user.id === pID
      ).user.username + playerFieldSeparator;
  });
  players =
    players.length > 0
      ? players.substr(0, players.length - playerFieldSeparator.length)
      : "Aucun inscrit";
  const me = new MessageEmbed()
    .setAuthor(author.username, author.avatarURL())
    .setColor(
      event.status === client.config.EVENT_STATUS.open
        ? client.config.TYPE.info.color
        : client.config.TYPE.danger.color
    )
    .setTitle(event.title)
    .addField(
      "`Status` : ",
      event.status === client.config.EVENT_STATUS.open
        ? "**INSCRIPTIONS OUVERTES**"
        : event.status === client.config.EVENT_STATUS.cancel
        ? "**EVENEMENT ANNULEE**"
        : "**EVENEMENT FERMEE**"
    )
    .addField(
      "`Heure du rendez-vous` : ",
      `**${moment(event.rdv).format("LLLL")}**`
    )
    .addField("`Joueurs` : ", `**${players}**`)
    .setTimestamp();

  if (event.image && event.image !== "") {
    me.setImage(event.image);
  } else {
    me.setThumbnail(client.config.URL_IMG_EVENT_DEFAULT);
  }
  if (event.description && event.description !== "")
    me.setDescription(`\`Description\` :\n${event.description}`);

  return me;
};
