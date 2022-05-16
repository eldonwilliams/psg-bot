import { MessageEmbed } from "discord.js";
import { CommandModule } from "../command-register";
import { hashElement } from "folder-hash";
import { join } from "path";
import { SlashCommandBuilder } from "@discordjs/builders";

let checksum = "LOADING?";
hashElement('.', { 'files': { 'include': ['*.js', '*.json', ], }, }).then((hash) => {
    checksum = hash.hash;
});

export default [
    {
        'handler': (interaction, client) => {
            interaction.reply({
                'embeds': [
                    new MessageEmbed()
                        .setColor('BLURPLE')
                        .setTimestamp()
                        .setTitle('Helpful Information')
                        .setDescription('Here\'s some helpful information about the bot')
                        .addFields(
                            {
                                'name': 'What is PSG Bot?',
                                'value': 'PSG Bot is the bot that makes this server function! While we do have other bots, our bot is a home-grown solution for all our needs. It runs the \'help\' section, which is a major part of our server.',
                            },
                            {
                                'name': 'How do I use PSG Bot?',
                                'value': 'PSG Bot is built on slash commands. To explore all the possible commands, just type \'/\' into the chat bar and click the PSG icon.',
                            },
                            {
                                'name': 'Open-source',
                                'value': 'This bot is fully open-source! We use GitHub to host the code... here: https://github.com/eldonwilliams/psg-bot. Feel free to contribute!',
                            },
                        )
                        .setAuthor({
                            'name': 'PSG Bot',
                            'iconURL': client.user.avatarURL() ?? "",
                        })
                        .setFooter({
                            'text': `Dist Hash : ${checksum}`
                        })
                ],
            })
        },
        'information': new SlashCommandBuilder()
            .setName("info")
            .setDescription("General information about the bot!")
            .toJSON(),
    },
    {
        'handler': (interaction, client) => {
            interaction.reply({
                'embeds': [
                    new MessageEmbed()
                        .setColor('BLURPLE')
                        .setTimestamp()
                        .setDescription("Source hosted on <:github:975470799706275890>.\nWritten in <:typescript:975475840756359229>.\nCoded using <:vscode:975475840513114142>.")
                        .addFields(
                            {
                                'name': 'Helpful Links',
                                'value': "\n__**Our Stuff!**__\n\n<a:verify:975475279059386439> <@476293488049389571> **- Owner**\n<a:discord:975471501761462352> *https://discord.gg/FWvx9VSJjV* **- Invite Link**\n<a:bird_github:975471254553362494> *https://github.com/eldonwilliams/psg-bot* **- GitHub Repo**\n\n__**Major Technologies Used**__\n\n<:typescript:975475840756359229> https://www.typescriptlang.org/ **- Typescript (Coding Language)**\n<:discordjs:975475840596996136> https://discord.js.org/ **- Discord.js (API Wrapper)**\n<:vscode:975475840513114142> https://code.visualstudio.com/ **- Visual Studio Code (IDE)**\n<:nodejs:975475840785731614> https://nodejs.org/ **- NodeJS (Runtime)**\n<:npm:975475840261435402> https://www.npmjs.com/ **- NPM (Package Manager)**",
                            }
                        )
                        .setAuthor({
                            'name': 'PSG Bot',
                            'iconURL': client.user.avatarURL() ?? "",
                        })
                        .setFooter({
                            'text': `Dist Hash : ${checksum}`
                        })
                        .setImage('attachment://psg-long.png')
                ],
                'files': [ join(__dirname, '../../static/images/psg-long.png'), ],
            })
        },
        'information': new SlashCommandBuilder()
            .setName('links')
            .setDescription('A collection of links that you may want')
            .toJSON(),
    }
] as CommandModule;