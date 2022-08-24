const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause a song or list of songs'),
	/**
     * @param {Interaction} interaction
     */
	async execute(interaction) {
        const queue = player.getQueue(interaction.guildId);
        player.isVoiceChannel(interaction);
        player.isQueue(interaction);
        try {
            await interaction.deferReply();
            queue.setPaused(true);
            return await interaction.followUp({ content: `⏸ | Paused music **${queue.current.title}**!` });
        } catch {
            
        }       
	},
};