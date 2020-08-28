const { Client, Collection } = require("discord.js");
const { PREFIX, CD_COMMAND_DEFAULT } = require("./config");
const { loadCommands, loadEvents, loadMongoose } = require("./utils/init");
require("dotenv").config();

const client = new Client();
["commands", "cooldowns"].forEach((x) => (client[x] = new Collection()));

loadCommands(client);
loadEvents(client);
loadMongoose(client);
//add mongoose custom options to client
require("./utils/functions")(client);

// log the bot
client.login(process.env.DISCORD_BOT_TOKEN);
