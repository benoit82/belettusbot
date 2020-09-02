const mongoose = require("mongoose");
const { Guild, Event } = require("../models");
const moment = require("moment");
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
    const createEvent = await new Event(merged);
    try {
      const eventCreated = await createEvent.save();
      channel.send(
        `Evènement créé => ${event.title} pour le **${moment(event.rdv).format(
          "LLLL"
        )}**`
      );
      return true;
    } catch (error) {
      channel.send(
        `⚠️ Une erreur est survenue durant le processus de la création de l'évènement ⚠️\n${error.message}\nVeuillez recommencer ultérieurement.`
      );
      return false;
    }
  };

  client.getEvent = async (event) => {
    const data = await Event.findOne({ createdAt: event.createdAt });
    if (data) return data;
    return;
  };

  client.updateEvent = async (event, settings) => {
    let data = await client.getEvent(event);
    if (typeof data !== "object") data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
    }
    return data.updateOne(settings);
  };
};
