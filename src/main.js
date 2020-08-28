const { Client, Collection } = require("discord.js");
const { PREFIX, CD_COMMAND_DEFAULT } = require("./config");
const { loadCommands, loadEvents } = require("./utils/init");
require("dotenv").config();
const client = new Client();
["commands", "cooldowns"].forEach((x) => (client[x] = new Collection()));
client.mongoose = require("./utils/mongoose");
require("./utils/functions")(client);

loadCommands(client);
loadEvents(client);

client.mongoose.init();

// log the bot
client.login(process.env.DISCORD_BOT_TOKEN);
