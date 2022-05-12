import { Command, CommandHandler } from "../command-register";
import { cancelReply } from "../util/cancelReply";

const handler: CommandHandler = async (interaction) => {
    interaction.isCommand() && cancelReply(interaction);
    interaction.channel?.send('Ping! :ping_pong:').then((m) => m.react(':white_check_mark:'));
}

export default {
    'handler': handler,
    'information': {
        'name': 'ping',
        'description': 'Replies with Pong!'
    },
} as Command;