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
        
            
	async execute(interaction) {
        const queue = player.getQueue(interaction.guildId);

        if (!queue) return interaction.reply({ content: `${interaction.member} Music is not playing at this moment`, ephemeral: true});

        const vol = interaction.options.getInteger('volume');
        queue.setVolume(vol);
        return interaction.reply(`Changed volume to **${vol}**`)
    }
};