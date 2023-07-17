const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Collection, Colors } = require('discord.js');
const fs = require('fs');
const config = require('../assets/dc_config.json');
const main_config = require('../assets/main_config.json');
const commands = [];
const commandCache = [];
const { EmbedBuilder } = require('discord.js');
const commandsDirectory = './discord/commands';
const rest = new REST({ version: '9' }).setToken(config.TOKEN);

const adding = false;

if (!fs.existsSync(commandsDirectory)) {
    fs.mkdirSync(commandsDirectory);
}


const commandFiles = fs.readdirSync(commandsDirectory).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    commandCache[command.data.name] = command;
}

async function loadCommands(client) {

    client.commands = new Collection();

    for (const command of commands) {
        client.commands.set(command.name, command);
    }
    if(adding) {
        try {
            console.log(main_config.prefix + 'Started refreshing application (/) commands.');
    
            await rest.put(
                Routes.applicationGuildCommands(config.ClientId, config.GuildId),
                { body: commands },
            );
    
            console.log(main_config.prefix + 'Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    }
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;
        const { commandName } = interaction;
        if (!client.commands.has(commandName)) return;
        if (commandCache[commandName].permissions) {
            const authorPermissions = interaction.member.permissions;

            for (const permission of commandCache[commandName].permissions) {
                if (!authorPermissions.has(permission)) {
                    const embed = new EmbedBuilder()
                    .setTitle('Mongo (-) Keine Berechtigung')
                    .setDescription('> Für diese Aktion hast du nicht ausreichend Permissions!')
                    .setTimestamp()
                    .setColor(Colors.Red)
                    .setFooter({
                        text: main_config.defaultFooter,
                        iconURL: 'https://media.discordapp.net/attachments/1042537693608947843/1129722079919484989/mn_server_logo_animated.gif'
                    })
                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        try {
            await commandCache[commandName].execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Beim Ausführen dieses Befehls ist ein Fehler aufgetreten!',
                ephemeral: true,
            });
        }
    });
}

module.exports = {
    refreshCommands: loadCommands
}