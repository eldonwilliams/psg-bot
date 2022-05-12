import { Interaction } from "discord.js";

const cancelReply = (interaction: Interaction) => {
    if (interaction.isCommand()) interaction.deferReply().then(() => interaction.deleteReply());
}

export { cancelReply, };