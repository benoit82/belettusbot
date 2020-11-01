const mongoose = require("mongoose");
const { Guild, Event, Template } = require("../models");
const moment = require("moment");
const { logAction } = require("./botlog");
const { embedCreateFromEvent } = require("./functions");
moment.locale("fr");

module.exports = async (client) => {
  client.createGuild = async (guild) => {
    const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, guild);
    const createGuild = await new Guild(merged);
    createGuild
      .save()
      .then((g) => {
        console.log(`Nouveau serveur => ${g.guildName}`);
        client.guildsConfig.set(g.guildID, g);
      })
      .catch((err) =>
        console.error(
          `Une erreur est survenue durant le processus de création d'enregistrement de la guilde (serveur discord) : ${err.message}`
        )
      );
  };

  client.getGuild = async (guild) => {
    const data = await Guild.findOne({ guildID: guild.id });
    if (data) return client.guildsConfig.set(guild.id, data);
    return client.config.DEFAULTSETTINGS;
  };

  client.setGuildsConfig = async () => {
    const datas = await Guild.find();
    if (datas) {
      datas.forEach((data) => {
        client.guildsConfig.set(data.guildID, data);
      });
    }
  };

  client.updateGuild = async (guild, settings) => {
    let data = await client.guildsConfig.get(guild.id);
    if (typeof data !== "object") data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
    }
    await data.updateOne(settings);
    return await client.getGuild(guild);
  };

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
  client.getActiveEventsByCreator = async (user, guild) => {
    const datas = await Event.find({
      creator: user.id,
      guildID: guild.id,
      status: client.config.EVENT_STATUS.open,
    });
    return datas ? datas : null;
  };

  client.getNextActiveEvents = async (days, guild) => {
    const datas = await Event.find({
      status: client.config.EVENT_STATUS.open,
      guildID: guild.id,
      rdv: { $gte: moment(), $lte: moment().add(days, "days") },
    });
    return datas ? datas : null;
  };

  client.removeOldEvents = async (guild, message = undefined) => {
    const { channels } = client;
    const guildConfig = client.guildsConfig.get(guild.id);
    const query = {
      rdv: { $lte: moment() },
      guildID: guild.id,
    };
    const datas = await Event.find(query);
    if (datas && datas.length > 0) {
      const evtChannel = await channels.fetch(guildConfig.eventChannel);
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
        if (message !== undefined) {
          return logAction(
            client,
            message,
            {
              name: "clearEvents",
              typeInfoLog,
            },
            feedback
          );
        } else {
          return true;
        }
      });
    } else {
      console.log(
        moment().format("llll") +
          "-> Aucun évènement à effacer trouvé pour la guilde : " +
          guild.name
      );
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

  client.createTemplate = async (template, channel) => {
    const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, template);
    const createTmpl = await new Template(merged);
    try {
      const tmplCreated = await createTmpl.save();
      channel.send(`Modèle d'évènement créé => ${template.name}`);
      return tmplCreated;
    } catch (error) {
      channel.send(
        `⚠️ Une erreur est survenue durant le processus de la création du template ⚠️\n${error.message}\nVeuillez recommencer ultérieurement.`
      );
      return false;
    }
  };

  client.updateTemplate = async (template, settings) => {
    let data = await client.getTemplateByName(template.name, template.guildID);
    if (typeof data !== "object") data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
    }
    await data.updateOne(settings);
    return await client.getTemplateByName(template.name, template.guildID);
  };

  client.getTemplateByName = async (name, guildID) => {
    const data = await Template.findOne({
      name,
      guildID,
    });
    if (typeof data !== "object") data = null;
    return data;
  };
  client.getTemplates = async (guildID, lang) => {
    const datas = await Template.find({ guildID, lang });
    return datas;
  };

  client.deleteTemplate = async (name, lang) => {
    const data = await Template.findOne({ name, lang });
    if (data !== null) {
      return await Template.deleteOne({ name, lang });
    }
  };
};
