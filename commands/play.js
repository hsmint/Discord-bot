const { play } = require('../function/stream');
const { getSong } = require('../function/youtube');
const { msgSend } = require('../function/message');

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
      if (!queue) return msgSend(msg, 'Play', "I am not in voice channel");
       
      // Stopped music because no queue
      if (queue.songs.length === 0) return msgSend(msg, 'Play', "There is no song playing");

      if (queue.pause) return msgSend(msg, 'Play', "The song is currently paused. Use resume command.");

      return msgSend(msg, 'Play', `Currently playing ${queue.songs[0].title}`);
    }

    // Playing music
    if (args.length === 1) {

      // Getting song info from youtube
      const songArray = await getSong(args[0]);
      
      // If setting up data is already done before
      if (queue) {
        for (let i = 0; i < songArray.length; i++) {
          queue.songs.push(songArray[i]);
        }
        // There is no song playing
        if (!queue.status) {
          msgSend(msg, 'Play', `Playing ${queue.songs[0].title}`);
          try{
            return play(msg);
          } catch (error) {
            queue.songs.shift();
            return msgSend(msg, 'Play', 'Error Playing. Please try again.');
          }
        }
        // Playing song in voice channel
        else {
          return msgSend(msg, 'Play', 'Added Song to queue');
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
        msgSend(msg ,'Play', `Playing ${data.songs[0].title}`)
        play(msg);
      } catch (error) {
        console.error(error);
      }
    }
  }
}