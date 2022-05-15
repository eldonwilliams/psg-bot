import { config, } from 'dotenv';
config();

import { Client, ColorResolvable, EmbedFieldData, Intents, MessageEmbed } from 'discord.js';
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

const sendUpdateToOwner = (title: string, color: ColorResolvable, description: string, ...fields: EmbedFieldData[]) =>
    client.users.fetch(process.env.OWNER_ID ?? "").then((user) => user.send({
        'embeds': [
            new MessageEmbed()
                .setFields(...fields)
                .setTimestamp()
                .setTitle(title)
                .setColor(color)
                .setDescription(description),
        ],
}));

client.on('error', (error) => {
    sendUpdateToOwner('ERROR', 'RED', error.message, { 'name': 'Name', 'value': error.name, }, { 'name': 'Stack', 'value': error.stack ?? 'NO STACK', });
});

client.on('warn', (message) => {
    sendUpdateToOwner('WARN', 'ORANGE', message);
});

client.on('rateLimit', (rld) => {
    sendUpdateToOwner('RATE LIMIT', 'BLURPLE', `\`\`\`${JSON.stringify(rld, null, 4)}\`\`\``)
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