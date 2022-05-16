import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandHandler, CommandModule } from "../command-register";
import { cancelReply } from "../util/cancelReply";

const handler: CommandHandler = async (interaction) => {
    if (!interaction.isCommand()) return;
    cancelReply(interaction);

    interaction.channel?.send({
        'content': 'Ping! :ping_pong:',
    }).then((m) => m.react('✅'));
}

export default {
    'handler': handler,
    'information': new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Tests that the bot is in working order!")
        .toJSON(),
} as CommandModule;