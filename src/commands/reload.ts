import { config } from "dotenv";
config();

import { ApplicationCommandOptionType } from "discord-api-types/v9";
import { Command, CommandHandler } from "../command-register";
import { LoadSlashCommands } from "../bot";
import { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from "discord.js";
import fetch from 'axios';

const handler: CommandHandler = async (interaction) => {
    if (!interaction.isCommand()) return;
    if (interaction.user.id != process.env.OWNER_ID) return;
    await interaction.deferReply();

    let section: number = interaction.options.getInteger('section', false) ?? 2;

    const slashCommands = () => LoadSlashCommands();
    const bot = () => {
        fetch({
            'method': 'POST',
            'url': `${process.env.RUNNER_API === "0" ? `http://localhost:${process.env.RUNNER_PORT}` : process.env.RUNNER_API}/restart`
        });
    };
    const all = () => { slashCommands(); }

    const picker = () => {
        let componentRow = new MessageActionRow()
            .setComponents(
                new MessageSelectMenu()
                    .setCustomId('sm')
                    .setPlaceholder('Select 1')
                    .setOptions([
                        {
                            'label': "All",
                            'value': "all",
                            'emoji': '📕',
                            'description': 'Reloads all parts of the bot.'
                        },
                        {
                            'label': "Slash Commands",
                            'value': "slash",
                            'emoji': '🤖',
                            'description': 'Re-registers the slash commands with Discord.'
                        },
                        {
                            'label': "Bot",
                            'value': "bot",
                            'emoji': '‼️',
                            'description': 'Reloads the ENTIRE bot (Not included in the \'All\' option)'
                        },
                    ]),
            );

        let componentRow2 = new MessageActionRow()
            .setComponents(
                new MessageButton()
                    .setCustomId('cancel')
                    .setEmoji('🚫')
                    .setStyle('SECONDARY')
                    .setLabel('Cancel'),
            );

        interaction.editReply({
            'embeds': [
                new MessageEmbed()
                    .setTitle("Action Required!")
                    .setDescription("Please select from the drop down menu which parts of the bot you would like to reload. If you would like to cancel, hit the X. As soon as you select an option, the action will occur.")
                    .setColor('RANDOM'),
            ],
            'components': [componentRow, componentRow2],
        }).then((replyMessage) => {
            if (replyMessage.type != "APPLICATION_COMMAND") return;
            let collector = replyMessage.createMessageComponentCollector({
                'componentType': 'SELECT_MENU',
                'filter': (c) => c.customId === "sm" && interaction.user.id === c.user.id,
                'max': 1,
            });

            let cancelCollector = replyMessage.createMessageComponentCollector({
                'componentType': 'BUTTON',
                'filter': (i) => i.customId === "cancel" && interaction.user.id === i.user.id,
                'max': 1,
            })
            
            cancelCollector.on('collect', (cancelInteraction) => {
                collector.stop();
                interaction.deleteReply();
                cancelInteraction.deferUpdate();
            });

            collector.on('collect', async (selectInteraction) => {
                if (!selectInteraction.isSelectMenu()) return; // TS Reasons
                cancelCollector.stop();
                selectInteraction.deferUpdate();
                interaction.editReply({ 
                    'embeds': [
                        new MessageEmbed()
                            .setColor('GREEN')
                            .setTitle('Success!')
                            .setDescription("The command to restart that system has been sent! Thank you. :)")
                    ],
                    'components': [],
                }).then(() => setTimeout(() => interaction.deleteReply(), 1000));

                switch (selectInteraction.values[0]) {
                    case 'all':
                        all();
                        break;
                    case 'slash':
                        slashCommands();
                        break;
                    case 'bot':
                        bot();
                        break;
                    default:
                        break;
                }
            });
        });
    };

    switch (section) {
        case 0:
            all();
            break;
        case 1:
            slashCommands();
            break;
        case 2:
            picker();
            return;
        case 3:
            bot();
            break;
        default:
            picker();
            break;
    }

    interaction.editReply({ 
        'embeds': [
            new MessageEmbed()
                .setColor('GREEN')
                .setTitle('Success!')
                .setDescription("The command to restart that system has been sent! Thank you. :)")
        ],
        'components': [],
    }).then(() => setTimeout(() => interaction.deleteReply(), 1000));
}

export default {
    'handler': handler,
    'information': {
        'name': 'reload',
        'description': 'Developer Only! Reloads a part of the bot (or all)',
        'options': [
            {
                'name': 'section',
                'description': 'The part of the bot you wish to reload',
                'type': ApplicationCommandOptionType.Integer,
                'choices': [
                    {
                        'name': 'All',
                        'value': 0,
                    },
                    {
                        'name': 'Slash Commands',
                        'value': 1,
                    },
                    {
                        'name': 'Bot',
                        'value': 3,
                    },
                    {
                        'name': 'Picker (Default)',
                        'value': 2,
                    }
                ],
            },
        ],
    },
} as Command;