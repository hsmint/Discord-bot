const ytdl = require('ytdl-core');
const { api } = require('../config.json');
const request = require('request');

module.exports = {
  async getInfo(msg, url) {
    const getUrl = url.split("list=");
    if (getUrl.length === 1) await getSong(msg, url);
    else await getPlaylist(msg, getUrl[1].substring(0, 34));
  }
}

async function getSong(msg, url) {
  const queue = msg.client.queue.get(msg.guild.id);
  const songInfo = await ytdl.getInfo(url);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url,
  };
  queue.songs.push(song);
}

async function getPlaylist(msg, listId, nextToken = undefined) {
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
  await request.get(option, function (error, response, body) {
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
    if (next !== undefined) getPlaylist(msg, listId, next);
  });
}