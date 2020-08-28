const { readdirSync } = require("fs");

module.exports = {
  loadCommands: (client, dir = "src/commands") => {
    readdirSync(dir).forEach((fold) => {
      const commands = readdirSync(`${dir}/${fold}`).filter((file) =>
        file.endsWith(".js")
      );

      for (const file of commands) {
        const getFileName = require(`../commands/${fold}/${file}`);
        client.commands.set(getFileName.help.name, getFileName);
        console.log(`Commande chargée : ${getFileName.help.name}`);
      }
    });
  },
  loadEvents: (client, dir = "src/events") => {
    {
      readdirSync(dir).forEach((fold) => {
        const events = readdirSync(`${dir}/${fold}`).filter((file) =>
          file.endsWith(".js")
        );

        for (const event of events) {
          const evt = require(`../events/${fold}/${event}`);
          const evtName = event.split(".")[0];
          client.on(evtName, evt.bind(null, client));
          console.log(`Evenement chargé : ${evtName}`);
        }
      });
    }
  },
  loadMongoose: (client) => {
    client.mongoose = require("../utils/mongoose");
    client.mongoose.init();
  },
};
