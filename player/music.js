const { Player } = require('discord-player');

class Music extends Player {
    constructor(client, options = {}) { 
        super(client, options = {});
        this.setting = {
            volume: 50
        };
    }

    async isVoiceChannel(interaction) {
        if (!interaction.member.voice.channelId) return await interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
    }
    
    async isQueue(interaction, queue) {
        if (!queue) return interaction.reply({ content: `${interaction.member} Music is not playing at this moment`, ephemeral: true});
    }

    getVolume() {
        return this.setting.volume;
    }

    setVolume(interaction) {
        this.setting.volume = interaction.options.getInteger('volume');
        const queue = this.getQueue(interaction.guildId);
        queue.setVolume(this.setting.volume);
        return this.setting.volume;
    }

    async joinVoiceChannel(interaction) {
        const queue = this.getQueue(interaction.guildId);
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            return await interaction.reply({ content: `I can't join the voice channel ${interaction.member}... try again ? ❌`, ephemeral: true});
        }
    }
}

exports.Music = Music;