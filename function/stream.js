const ytdl = require('ytdl-core');
const fs = require('fs');
const { msgSend } = require('../function/message');
const { changeActivity } = require('../index');

module.exports = {
  async play(msg) {
    const queue = msg.client.queue.get(msg.guild.id);
    queue.status = true;
    const song = queue.songs[0];
    ytdl(song.url, {filter: 'audioonly', quality: 'highestaudio'})
      .pipe(fs.createWriteStream(`./assets/song${msg.guild.id}.webm`))
      .on('error', error => {
        console.log(error);
        console.log(song.url);
        queue.songs.shift();
        msgSend(msg, 'Play', 'There is an error on url moving to next song');
        module.exports.play(msg);
      });
    setTimeout(() => {
      const dispatcher = queue.connection.play(`./assets/song${msg.guild.id}.webm`)
        .on('finish', () => {
          queue.songs.shift();
          changeActivity(msg);
          if (!queue.songs[0]) {
            dispatcher.end();
            queue.songs = [];
            queue.status = false;
          } else {
            return module.exports.play(msg);
          }
        })
        .on('error', error => console.log(error));
      dispatcher.setVolume(queue.volume / 10);
    }, 2000);
  }
}