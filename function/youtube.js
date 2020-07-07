const ytdl = require('ytdl-core');
const { api } = require('../config.json');
const request = require('request');

module.exports = {
  async getSong(msg, url) {
    const queue = msg.client.queue.get(msg.guild.id);
    const songInfo = await ytdl.getInfo(url);
    const song = {
      title: songInfo.title,
      url: songInfo.video_url,
    };
    queue.songs.push(song);
  },
  getPlaylist(msg, listId, nextToken = undefined) {
    const queue = msg.client.queue.get(msg.guild.id);
    let option = {
      uri: 'https://www.googleapis.com/youtube/v3/playlistItems',
      qs: {
        part: 'contentDetails',
        part: 'snippet',
        maxResults: 50,
        playlistId: listId,
        key: api,
        pageToken: nextToken
      }
    }
    request.get(option, function (error, response, body) {
      const obj = JSON.parse(body);
      const next = obj.nextPageToken;
      for (i in obj.items) {
        const item = obj.items[i].snippet
        const song = {
          title: item.title,
          url: 'https://www.youtube.com/watch?v=' + item.resourceId.videoId
        }
        queue.songs.push(song);
      }
      if (next !== undefined) module.exports.getPlaylist(msg, listId, next);
    });
  }
}