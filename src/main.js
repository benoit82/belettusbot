const { Client, Collection } = require("discord.js");
const {
  loadCommands,
  loadEvents,
  loadMongoose,
  loadGuildInfo,
} = require("./utils/loader");
require("dotenv").config();

const client = new Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
client.config = require("./config");
["commands", "cooldowns"].forEach((x) => (client[x] = new Collection()));

loadCommands(client);
loadEvents(client);
loadMongoose(client);
//add mongoose custom options to client
loadGuildInfo(client);

// log the bot
client.login(process.env.DISCORD_BOT_TOKEN);
