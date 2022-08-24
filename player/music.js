const { Player } = require('discord-player');
const queue = require('../commands/queue');

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
    
    async isQueue(interaction) {
        const queue = this.getQueue(interaction.guildId);
        if (!queue) return interaction.reply({ content: `${interaction.member} Music is not playing at this moment`, ephemeral: true});
    }

    getVolume() {
        return this.setting.volume;
    }

    getQueue(interaction) {
        let guild = this.client.guilds.resolve(interaction.guildId);
        const queue = this.queues.has(interaction.guildId)  ? this.queues.get(interaction.guildId) : this.createQueue(interaction.guild, {
            initialVolume: this.setting.volume,
            leaveOnStop: false,
            leaveOnEnd: false,
            metadata: {
                channel: interaction.channel
            },
            volumeSmoothness: 0.0
        });
        return queue;
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