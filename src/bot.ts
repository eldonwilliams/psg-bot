import { config, } from 'dotenv';
config();

import { Client, Intents, MessageEmbed } from 'discord.js';
import { collectCommands, CommandHandler, registerCommands } from './command-register';

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
    ]
});

const nameTable: { [command: string]: CommandHandler,} = {};

export function LoadSlashCommands() {
    registerCommands(process.env.CLIENT_ID ?? "", process.env.GUILD_ID ?? "");
    collectCommands().forEach((command) => nameTable[command.information.name ?? "NAME REQ"] = command.handler);
}

client.on('ready', (loadedClient) => {
    loadedClient.user.setActivity({
        'name': process.env.ACTIVITY_NAME ?? "Configuration Didn't Say :(",
        'type': "PLAYING",
    });

    LoadSlashCommands();

    console.log(`The bot is up as ${loadedClient.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    (
        nameTable[interaction.commandName] ??
        (() => {
            let embed = new MessageEmbed()
                .setTitle('Error!')
                .setColor('RED')
                .setDescription("That command wasn't found internally, but it was registered with Discord. Something weird is going on. Contact Eldon if this persists!");

            interaction.reply({
                "embeds": [embed],
                "ephemeral": true,
            });
        })
    )(interaction, client);
});

client.login(process.env.TOKEN);