const { play } = require('../function/stream');
const { loadSong } = require('../function/youtube');
const { msgSend } = require('../function/message');

module.exports = {
  name: "play",
  description: "Playing a song on voice channel",
  async execute(msg, args) {
    const queue = msg.client.queue.get(msg.guild.id);
    const voiceChannel = msg.member.voice.channel;

    // Client not in voice channel
    if (!voiceChannel) return msg.reply('You are not in voice channel');

    // Playing music
    if (args.length === 1) {
      
      // If setting up data is already done before
      if (queue) {
        await loadSong(msg, args[0]);

        // There is no song playing
        if (!queue.status) {
          try{
            play(msg);
            msgSend(msg, 'Play', `Playing **${queue.songs[0].title}**`);
          } catch (error) {
            queue.songs.shift();
            msgSend(msg, 'Play', 'Error Playing. Please try again.');
          }
        }

        // Playing song in voice channel
        else {
          msgSend(msg, 'Play', 'Added Song to queue');
        }
        return;
      }

      // Constructing data
      const data = {
        connection: null,
        volume: 5, // volume of bot
        songs: [], // queue of songs
        status: true, // playing music
        pause: false, // paused music
        repeat: false,
      };

      msg.client.queue.set(msg.guild.id, data);
      await loadSong(msg, args[0]);
      
      // Try to join voice channel
      try {
        const connection = await voiceChannel.join();
        data.connection = connection;
        msgSend(msg ,'Play', `Playing **${data.songs[0].title}**`)
        play(msg);
      } catch (error) {
        console.error(error);
      }
    }
  }
}