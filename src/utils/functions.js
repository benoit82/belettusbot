const mongoose = require("mongoose");
const { Guild } = require("../models");

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
};
