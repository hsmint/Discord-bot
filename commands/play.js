const { play } = require('../function/stream');
const { getSong } = require('../function/youtube');

module.exports = {
  name: "play",
  description: "Playing a song on voice channel",
  async execute(msg, args) {

    const queue = msg.client.queue.get(msg.guild.id);
    const voiceChannel = msg.member.voice.channel;

    // Client not in voice channel
    if (!voiceChannel) return msg.reply('You are not in voice channel');

    // Playing by Queue
    if (args.length === 0) {
      // No song in queued
      if (!queue) return msg.reply("I am not in voice channel");

      // Stopped music because no queue
      if (queue.songs.length === 0) return msg.reply("No songs in queue.");

      return play(msg);
    }

    // Playing music
    if (args.length === 1) {

      // Getting song info from youtube
      const songArray = await getSong(args[0]);

      // If setting up data is already done before
      if (queue) {
        for (song in songArray) {
          queue.songs.push(song);
        }
        // There is no song playing
        if (!queue.status) return play(msg);

        // Playing song in voice channel
        else {
          for (let i = 0; i < songArray.length; i++) {
            queue.songs.push(songArray[i]);
          }
          return;
        }
      }

      // Constructing data
      const data = {
        connection: null,
        volume: 5,
        songs: [],
        status: true,
        pause: false,
      };

      msg.client.queue.set(msg.guild.id, data);
      for (let i = 0; i < songArray.length; i++) {
        data.songs.push(songArray[i]);
      }
      // Try to join voice channel
      try {
        const connection = await voiceChannel.join();
        data.connection = connection;
        play(msg);
      } catch (error) {
        console.error(error);
      }
    }
  }
}