const Discord = require('discord.js');
const config = require('../assets/dc_config.json');
const mainConfig = require('../assets/main_config.json');
const commandLoader = require('./CommandLoader.js');
const backendWorker = require('./worker/BackendWorker');

const client = new Discord.Client({
    intents:
        [
            Discord.GatewayIntentBits.Guilds,
            Discord.GatewayIntentBits.GuildMessages,
            Discord.GatewayIntentBits.GuildMessageReactions,
            Discord.GatewayIntentBits.GuildMembers,
            Discord.GatewayIntentBits.GuildPresences,
            Discord.GatewayIntentBits.GuildMessageTyping,
            Discord.GatewayIntentBits.DirectMessages,
            Discord.GatewayIntentBits.DirectMessageReactions,
            Discord.GatewayIntentBits.DirectMessageTyping,
        ]
});

client.on('ready', async () => {
    console.log(mainConfig.prefix + "Der DiscordBot wurde erfolgreich gestartet!");
    commandLoader.refreshCommands(client);
});


async function login() {
    console.log(mainConfig.prefix + "Der DiscordBot wird nun gestartet!");
    client.login(config.TOKEN)
}

async function getDc(id, callback) {
    const guild = client.guilds.cache.get(config.GuildId);
    let found = false;
    (await guild.members.fetch()).filter((member) => {
        if(member.id == id) {
            found = true;
        }
    });
    callback(null, found);
}


async function addRulesRole(id) {
    const guild = client.guilds.cache.get(config.GuildId);
    const member = await guild.members.fetch(id);
    const role = await guild.roles.fetch('1130450223391580280');
    await member.roles.add(role);
}

module.exports = {
    startBot: login,
    getDc: getDc,
    addRulesRole: addRulesRole,
}