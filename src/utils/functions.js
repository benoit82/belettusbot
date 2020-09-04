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
  if (newSetting.match(client.config.REGEX.DISCORD_ID_FORMAT)) {
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
  const author = message.channel.members.find(
    (member) => member.id === event.creator
  ).user;

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
    .setTimestamp();

  if (event.image && event.image !== "") {
    me.setImage(event.image);
  } else {
    me.setThumbnail(client.config.URL_IMG_EVENT_DEFAULT);
  }
  if (event.description && event.description !== "")
    me.setDescription(`\`Description\` :\n${event.description}`);

  // players display
  let obj = {};
  let divers = [];
  if (event.players && event.players.length > 0) {
    event.players.forEach((player) => {
      //if the tag is in a job list category, we add the player to the category
      let findCat = false;
      Object.entries(client.config.JOB_LIST).forEach((role) => {
        role[1].forEach((job) => {
          if (job === player[1]) {
            const cat = role[0];
            if (!obj[cat]) obj[cat] = [];
            player = [...player];
            obj[cat] = [...obj[cat], player];
            findCat = true;
          }
        });
      });
      if (!findCat) divers = [...divers, player];
    });

    if (divers.length > 0) obj = { ...obj, divers };

    Object.entries(obj)
      .sort((cat1, cat2) => {
        return cat1[0] > cat2[0] ? 1 : -1;
      })
      .forEach((category) => {
        let playersStringBuilder = "";
        category[1].forEach((player) => {
          const emojiBuilder =
            player[1] && player[1].match(client.config.REGEX.DISCORD_ID_FORMAT)
              ? client.emojis.cache.get(player[1]).toString()
              : "✅";
          playersStringBuilder += emojiBuilder + " <@" + player[0] + ">\n";
        });
        // finally we add fieds
        me.addField(
          category[0] + " (" + category[1].length + ")",
          playersStringBuilder,
          true
        );
      });
  } else {
    me.addField("Actuellement...", "Aucun joueur inscrit.");
  }

  return me;
};

exports.emojiReactionCheck = (emoji_list, emojiID) => {
  let tabAvailableEmojiID = [];
  Object.entries(emoji_list).forEach((role) => {
    Object.entries(role).forEach((job) => {
      if (job[0] === "1")
        tabAvailableEmojiID = [...tabAvailableEmojiID, Object.values(job[1])];
    });
  });
  tabAvailableEmojiID = tabAvailableEmojiID.flat();
  // TODO : si la condition dans le log est vrai, alors c'est un emoji de role sinon => category autre,
  // si l'user a déjà réagi, on efface sa nouvelle reaction, il devra annuler sa reaction precedente pour mettre un nouveau
  emoji_list.includes(emojiID);
  return ["role", "emoji"];
};
