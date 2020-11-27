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
    if (getList.length === 1) {
      getList = getList[0].split('&');
      getList = getList[0].split('v=')
      await getSong(msg, getList[1]);
    } else {
      getList = getList[1].split('&');
      getList = getList[0].split('/');
      await getPlaylist(msg, getList[0]);
    }
    return true;
  }
}

async function getSong(msg, videoId) {
  const queue = msg.client.queue.get(msg.guild.id);
  let option = {
    uri: 'https://www.googleapis.com/youtube/v3/videos',
    qs: {
      part: 'snippet',
      id: videoId,
      key: api,
    }
  }
  try {
    await request.get(option, function(error, response, body) {
      const obj = JSON.parse(body);
      const title = obj.items[0].snippet.title;
      const song = {
        title: title,
        url: 'https://www.youtube.com/watch?v=' + videoId
      };
      queue.songs.push(song);
    });
  } catch(error) {
    console.log(error)
  }
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
  try {
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
  } catch(error) {
    console.log(error)
  }
}
// https://www.youtube.com/watch?v=q8lYrRzgYD4&ab_channel=1theK%28%EC%9B%90%EB%8D%94%EC%BC%80%EC%9D%B4%29