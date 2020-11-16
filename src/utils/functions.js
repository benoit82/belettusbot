const { MessageEmbed } = require("discord.js");
const timeInterface = require("./timeInterface");

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
  const guildConfig = client.guildsConfig.get(message.guild.id);
  if (!args[1]) {
    return message.channel.send(
      `\`#${client.channels.cache.get(guildConfig[args[0]]).name}\``
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
  const chanName = client.channels.cache.get(guildConfig[args[0]]).name;
  if (chanName) {
    message.channel.send(
      `${args[0]} mis à jour du salon : \`#${chanName}\` => \`#${res.name}\``
    );
  }
  return;
};

exports.embedCreateFromEvent = (client, message, event) => {
  const guildConfig = client.guildsConfig.get(message.guild.id);
  const author =
    message.channel.members.find((member) => member.id === event.creator)
      .user || client.user;

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
        ? "**EVENEMENT ANNULE**"
        : "**EVENEMENT FERME**"
    )
    .addField(
      "`Heure du rendez-vous` : ",
      `**${timeInterface(event.rdv).format("LLLL")}**`
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
    // sort the player list by registration date
    event.players.sort((p1, p2) => {
      return p1.registrationDate &&
        p2.registrationDate &&
        p1.registrationDate > p2.registrationDate
        ? 1
        : -1;
    });
    me.addField(
      "`Participants *#XX = ordre d'inscription*`",
      `${event.players.length} personne(s) inscrite(s)`
    );
    event.players.forEach((player, index) => {
      player.order = player.registrationDate ? index + 1 : "??"; // case for event before 1.1.0
      //if the tag is in a job list category, we add the player to the category
      let findCat = false;
      Object.entries(guildConfig.reactRoles).forEach((role) => {
        if (Array.isArray(role[1])) {
          role[1].forEach((job) => {
            if (job === player.reactEmoji) {
              const cat = role[0];
              if (!obj[cat]) obj[cat] = [];
              obj[cat] = [...obj[cat], player];
              findCat = true;
            }
          });
        }
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
          const emojiBuilder = client.emojis.cache.has(player.reactEmoji)
            ? client.emojis.cache.get(player.reactEmoji).toString()
            : player.reactEmoji.match(client.config.REGEX.DISCORD_ID_FORMAT)
            ? "✅"
            : player.reactEmoji;
          playersStringBuilder +=
            "**#" +
            player.order.toString().padStart(2, "0") +
            "**-" +
            emojiBuilder +
            " <@" +
            player.id +
            ">\n";
          //playersStringBuilder += emojiBuilder + " <@" + player.id + ">\n";
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
