const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resume a song or list of songs'),
	/**
     * @param {Interaction} interaction
     */
	async execute(interaction) {
        const queue = player.getQueue(interaction.guildId);
		if (!interaction.member.voice.channelId) return await interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
        if (!queue) return interaction.reply({ content: `${interaction.member} Music is not playing at this moment`, ephemeral: true});
        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) return await interaction.reply({ content: "You are not in my voice channel!", ephemeral: true });
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            return interaction.reply({ content: `I can't join the voice channel ${interaction.member}... try again ? ❌`, ephemeral: true});
        }
        
		await interaction.deferReply();
        queue.setPaused(false);
        return await interaction.followUp({ content: `🎵 | Resume music **${queue.current.title}**!` });
	},
};