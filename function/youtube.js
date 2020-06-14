const ytdl = require('ytdl-core');

module.exports = {
  async getSong(url) {
    const songArray = [];
    const songInfo = await ytdl.getInfo(url);
    const song = {
      title: songInfo.title,
      url: songInfo.video_url,
    };
    songArray.push(song);
    return songArray;
  }
}