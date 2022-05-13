const cancelReply = async (interaction: { [some: string]: any, }) => {
    if (interaction.deferReply && interaction.deleteReply) {
        await interaction.deferReply();
        interaction.deleteReply();
    }
}

export { cancelReply, };