import { config, } from 'dotenv';
config();

import { Client, Intents } from 'discord.js';
import { collectCommands, CommandHandler, registerCommands } from './command-register';

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
    ]
});

const nameTable: { [command: string]: CommandHandler,} = {};

client.on('ready', (loadedClient) => {
    loadedClient.user.setActivity({
        'name': process.env.ACTIVITY_NAME ?? "Configuration Didn't Say :(",
        'type': "PLAYING",
    });

    registerCommands(process.env.CLIENT_ID ?? "", process.env.GUILD_ID ?? "");

    collectCommands().forEach((command) => nameTable[command.information.name ?? "NAME REQ"] = command.handler);

    console.log(`The bot is up as ${loadedClient.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    (
        nameTable[interaction.commandName] ??
        (() => {
            interaction.reply({
                "content": "That command wasn't found internally, but it was registered with Discord. Something weird is going on. Contact Eldon if this persists!",
            });
        })
    )(interaction, client);
});

client.login(process.env.TOKEN);