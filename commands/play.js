const fs = require('fs');
const ytdl = require('ytdl-core');
const { api } = require('../config.json');
const YOUTUBE = require('discord-youtube-api');


module.exports = {
  name: "play",
  description: "Playing a song on voice channel",
  async execute(msg, args) {

    const queue = msg.client.queue.get(msg.guild.id);
    const voiceChannel = msg.member.voice.channel;

    // Client not in voice channel
    if (!voiceChannel) return msg.reply('You are not in voice channel');

    // Downloading music and playing music
    const play = async song => {
      const queue = msg.client.queue.get(msg.guild.id);
      queue.status = true;
      ytdl(song.url, {filter: 'audioonly', quality: 'highestaudio'}).pipe(fs.createWriteStream(`./assets/song${msg.guild.id}.webm`));
      setTimeout(() => {
        const dispatcher = queue.connection.play(`./assets/song${msg.guild.id}.webm`)
          .on('finish', () => {
            queue.songs.shift();
            if (!queue.songs[0]) {
              dispatcher.end();
              queue.status = false;
            } else this.play(msg, queue.songs[0]);
          })
          .on('error', error => console.log(error));
        dispatcher.setVolume(queue.volume / 10);
      }, 2000);
    }

    // Playing music
    if (args.length === 1) {
      // Getting song info from youtube
      const songArray = await this.getSong(args[0]);
      // If setting up data is already done before
      if (queue) {
        for (song in songArray) {
          queue.songs.push(song);
        }
        // There is no song playing
        if (!queue.status) return play(queue.songs[0]);
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
      };

      msg.client.queue.set(msg.guild.id, data);
      for (let i = 0; i < songArray.length; i++) {
        data.songs.push(songArray[i]);
      }
      // Try to join voice channel
      try {
        const connection = await voiceChannel.join();
        data.connection = connection;
        play(data.songs[0]);
      } catch (error) {
        console.error(error);
      }
    }
  },
  async getSong(url) {
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;;
    const isValid = pattern.test(url);
    let videoArray;
    const songArray = [];
    if (isValid) {
      const youtube = new YOUTUBE(api);
      videoArray = await youtube.getPlaylist(url);
      for (let i = 0; i < videoArray.length; i++) {
        const song = {
          title: videoArray[i].title,
          url: videoArray[i].url
        };
        songArray.push(song);
      }
    } else {
      const songInfo = await ytdl.getInfo(url);
      const song = {
        title: songInfo.title,
        url: songInfo.video_url,
      };
      songArray.push(song);
    }
    return songArray;
  }
}