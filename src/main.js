require("dotenv").config();
const { Client, Collection } = require("discord.js");
const {
  loadCommands,
  loadEvents,
  loadMongoose,
  loadGuildsInfo,
} = require("./utils/loader");

const client = new Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
client.config = require("./config");
["commands", "cooldowns", "guildsConfig"].forEach(
  (x) => (client[x] = new Collection())
);

const autoRemoveEvent = (client) => {
  client.guilds.cache.each(async (guild) => {
    await client.removeOldEvents(guild);
  });
};

loadCommands(client);
loadEvents(client);
loadMongoose(client);
//add mongoose custom options to client
loadGuildsInfo(client);

// log the bot, once loggedin removing all old events
client.login(process.env.DISCORD_BOT_TOKEN).then(() => {
  autoRemoveEvent(client);
  setInterval(() => autoRemoveEvent(client), 360 * 1000);
});
