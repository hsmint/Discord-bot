const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Set volume when playing music')
        .addIntegerOption(option =>
            option.setName('volume')
                .setDescription('Volume 1 ~ 100')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)),
                
    /**
     * @param {Interaction} interaction
     */
	async execute(interaction) {
        player.setVolume(interaction);
        return interaction.reply(`🔉 | Changed volume **${player.getVolume()}**`);
    }
};