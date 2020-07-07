const { play } = require('../function/stream');
const { getSong, getPlaylist } = require('../function/youtube');
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
      const getList = url.split("list=");
      if (!chk.test(url)) return msgSend(msg, 'Play', 'Not valid URL');

      // If setting up data is already done before
      if (queue) {
        if (getList.length === 1) await getSong(msg, url);
        else await getPlaylist(msg, getList[1].substring(0, 34));
        // There is no song playing
        setTimeout(() => {
          if (!queue.status) {
            try{
              play(msg);
              msgSend(msg, 'Play', `Playing ${queue.songs[0].title}`);
            } catch (error) {
              queue.songs.shift();
              msgSend(msg, 'Play', 'Error Playing. Please try again.');
            }
          }
          // Playing song in voice channel
          else {
            msgSend(msg, 'Play', 'Added Song to queue');
          }
        }, 5000);
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
      if (getList.length === 1) await getSong(msg, url);
      else await getPlaylist(msg, getList[1].substring(0, 34));
      
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