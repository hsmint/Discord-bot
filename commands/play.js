const { play } = require('../function/stream');
const { getInfo } = require('../function/youtube');
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
      const url = args[0];
      const chk = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
      if (!chk.test(url)) return msgSend(msg, 'Play', 'Not valid URL');

      // If setting up data is already done before
      if (queue) {
        await getInfo(msg, url);
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
        repeat: false,
      };

      msg.client.queue.set(msg.guild.id, data);
      await getInfo(msg, url);
      
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