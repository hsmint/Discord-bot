const ytdl = require('ytdl-core');
const { api } = require('../config.json');
const request = require('request-promise-native');
const { msgSend } = require('../function/message');

module.exports = {
  async loadSong(msg, url) {
    const chk = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
    
    if (!chk.test(url)) {
      msgSend(msg, 'Play', 'Not valid URL');
      return false;
    }

    let getList = url.split("list=");
    if (getList.length === 1)
      await getSong(msg, url);
    else {
      getList = getList[1].split('&');
      getList = getList[0].split('/');
      await getPlaylist(msg, getList[0]);
    }
    return true;
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

async function getPlaylist(msg, listId) {
  const queue = msg.client.queue.get(msg.guild.id);
  let next = undefined;
  let option = {
    uri: 'https://www.googleapis.com/youtube/v3/playlistItems',
    qs: {
      part: 'contentDetails, snippet',
      maxResults: 50,
      playlistId: listId,
      key: api,
      pageToken: undefined,
    }
  }
  do {
    await request.get(option, function(error, response, body) {
      const obj = JSON.parse(body);
      option.qs.pageToken = next = obj.nextPageToken;
      for (i in obj.items) {
        const item = obj.items[i].snippet
        const song = {
          title: item.title,
          url: 'https://www.youtube.com/watch?v=' + item.resourceId.videoId
        }
        queue.songs.push(song);
      }
    });
  } while(next !== undefined);
}