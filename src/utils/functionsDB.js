const mongoose = require("mongoose");
const { Guild, Event } = require("../models");
const moment = require("moment");
const guild = require("../models/guild");
const { logAction } = require("./botlog");
const { embedCreateFromEvent } = require("./functions");
moment.locale("fr");

module.exports = async (client) => {
  client.createGuild = async (guild) => {
    const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, guild);
    const createGuild = await new Guild(merged);
    createGuild
      .save()
      .then((g) => console.log(`Nouveau serveur => ${g.guildName}`))
      .catch((err) =>
        console.error(
          `Une erreur est survenue durant le processus de création d'enregistrement de la guilde (serveur discord) : ${err.message}`
        )
      );
  };

  client.getGuild = async (guild) => {
    const data = await Guild.findOne({ guildID: guild.id });
    if (data) return data;
    return client.config.DEFAULTSETTINGS;
  };

  client.updateGuild = async (guild, settings) => {
    let data = await client.getGuild(guild);
    if (typeof data !== "object") data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
    }
    return data.updateOne(settings);
  };

  /**
   *
   * @param {Event} event
   * @param {Channel} channel
   * @return Boolean true if event record is OK, false if error has been catched
   */
  client.createEvent = async (event, channel) => {
    const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, event);
    const createEvt = await new Event(merged);
    try {
      const eventCreated = await createEvt.save();
      channel.send(
        `Evènement créé => ${event.title} pour le **${moment(event.rdv).format(
          "LLLL"
        )}**`
      );
      return eventCreated;
    } catch (error) {
      channel.send(
        `⚠️ Une erreur est survenue durant le processus de la création de l'évènement ⚠️\n${error.message}\nVeuillez recommencer ultérieurement.`
      );
      return false;
    }
  };

  client.getEvent = async (event) => {
    const data = await Event.findOne({ messageID: event.messageID });
    if (data) return data;
    return;
  };
  client.getEventByCreator = async (user) => {
    const datas = await Event.find({
      creator: user.id,
      status: { $ne: client.config.EVENT_STATUS.close },
    });
    return datas ? datas : null;
  };

  client.removeOldEvents = async (guild, message = null) => {
    const { channels, settings } = client;
    const query = {
      rdv: { $lte: moment() },
      guildID: guild.id,
    };
    const datas = await Event.find(query);
    if (datas) {
      const evtChannel = await channels.fetch(settings.eventChannel);
      // unpin old event / setStatus on close
      datas.forEach(async (evt) => {
        evt.status = client.config.EVENT_STATUS.close;
        const msg = await evtChannel.messages.fetch(evt.messageID);
        msg.edit(embedCreateFromEvent(client, msg, evt));
        if (msg.pinned) msg.unpin({ reason: "évènement passé." });
      });
      await Event.deleteMany(query, (err) => {
        const feedback = err
          ? `Une erreur s'est déclanché lors de la suppression des anciens events\n${err.message}`
          : `Suppression des anciens events (nombre : ${datas.length})`;
        const typeInfoLog = err
          ? client.config.TYPE.danger.label
          : client.config.TYPE.warning.label;
        return logAction(
          client,
          {
            name: "clearEvents",
            typeInfoLog,
          },
          feedback,
          message
        );
      });
    }
  };

  client.updateEvent = async (event, settings) => {
    let data = await client.getEvent(event);
    if (typeof data !== "object") data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
    }
    await data.updateOne(settings);
    return await client.getEvent(event);
  };
};
