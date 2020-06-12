const YOUTUBE = require('discord-youtube-api');
const ytdl = require('ytdl-core');
const { api } = require('../config.json');

module.exports = {
  async getSong(url) {
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
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