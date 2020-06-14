const { play } = require('../function/stream');
const { getSong } = require('../function/youtube');

module.exports = {
  name: "play",
  description: "Playing a song on voice channel",
  async execute(msg, args) {

    const queue = msg.client.queue.get(msg.guild.id);
    const voiceChannel = msg.member.voice.channel;
    const embed = msg.client.msgEmbed;
    embed.title = "Play";

    // Client not in voice channel
    if (!voiceChannel) return msg.reply('You are not in voice channel');

    // Playing by Queue
    if (args.length === 0) {
      // No song in queued
      if (!queue) {
        msg.description = "I am not in voice channel";
        return msg.channel.send({embed: embed});
      }
      // Stopped music because no queue
      if (queue.songs.length === 0) {
        msg.description = "There is no song playing";
        return msg.channel.send({embed: embed});
      }

      if (queue.pause) {
        msg.description = "The song is currently paused. Use resume command.";
        return msg.channel.send({embed: embed});
      }
    }

    // Playing music
    if (args.length === 1) {

      // Getting song info from youtube
      const songArray = await getSong(args[0]);
      msg.description = `Playing ${songArray[0].title}`;
      msg.channel.send({embed: embed});
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
        volume: 5, // volume of bot
        songs: [], // queue of songs
        status: true, // playing music
        pause: false, // paused music
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