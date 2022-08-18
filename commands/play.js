const { SlashCommandBuilder } = require('discord.js');
const { getPlayerSetting } = require('../utils/config.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song or list of songs')
		.addStringOption(option => 
			option.setName('url')
				.setDescription('url for youtube songs')
				.setRequired(true)),
	/**
     * @param {Interaction} interaction
     */
	async execute(interaction) {
		if (!interaction.member.voice.channelId) return await interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
		if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) return await interaction.reply({ content: "You are not in my voice channel!", ephemeral: true });

		const url = interaction.options.getString('url');
		const queue = await player.createQueue(interaction.guild, {
			leaveOnStop: false,
			leaveOnEnd: false,
			metadata: {
				channel: interaction.channel
			}
		});
		try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            return await interaction.reply({ content: `I can't join the voice channel ${interaction.member}... try again ? ❌`, ephemeral: true});
        }
		await interaction.deferReply();
		const tracks = await player.search(url, {
            requestedBy: interaction.user
        }).then(x => x.tracks);
		try {
			const volume = getPlayerSetting('volume');
			queue.addTracks(tracks);
			queue.play();
			queue.setVolume(volume);
			return await interaction.followUp({ content: `🎵 | Now play track **${queue.current.title}**` });
		} catch (error) {
			return await interaction.followUp({ content: '💥 Error to play tracks'});
		}
	},
};