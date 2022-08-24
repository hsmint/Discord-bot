const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Leave channel'),
	/**
     * @param {Interaction} interaction
     */
	async execute(interaction) {
        const queue = player.getQueue(interaction.guildId);
        player.isVoiceChannel(interaction);
        player.isQueue(interaction);
        try {
            queue.clear();
            queue.connection.disconnect();
            return await interaction.reply({ content: `Leave the channel.` });
        } catch {
            return await interaction.reply({ content: `Already not in voice channel`});
        }
	},
};