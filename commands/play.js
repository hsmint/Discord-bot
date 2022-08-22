const { SlashCommandBuilder } = require('discord.js');

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
		await player.isVoiceChannel(interaction);
		
		const url = interaction.options.getString('url');
		let queue = player.getQueue(interaction.guild);
		if (!queue) {
			queue = await player.createQueue(interaction.guild, {
				initialVolume: player.setting.volume,
				leaveOnStop: false,
				leaveOnEnd: false,
				metadata: {
					channel: interaction.channel
				},
				volumeSmoothness: 0.0
			});
		}
		await player.joinVoiceChannel(interaction);
		await interaction.deferReply();
		const tracks = await player.search(url, {
            requestedBy: interaction.user
        }).then(x => x.tracks);
		try {
			queue.addTracks(tracks);
			queue.play();
			return await interaction.followUp({ content: `🎵 | Now play track **${queue.current.title}**` });
		} catch (error) {
			console.log(error);
			return await interaction.followUp({ content: '💥 Error to play tracks'});
		}
	},
};