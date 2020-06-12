const ytdl = require('ytdl-core');
const fs = require('fs');

module.exports = {
  async play(msg) {
    const queue = msg.client.queue.get(msg.guild.id);
    queue.status = true;
    const song = queue.songs[0];
    ytdl(song.url, {filter: 'audioonly', quality: 'highestaudio'}).pipe(fs.createWriteStream(`./assets/song${msg.guild.id}.webm`));
    setTimeout(() => {
      const dispatcher = queue.connection.play(`./assets/song${msg.guild.id}.webm`)
        .on('finish', () => {
          queue.songs.shift();
          if (!queue.songs[0]) {
            dispatcher.end();
            queue.status = false;
          } else module.exports.play(msg);
        })
        .on('error', error => console.log(error));
      dispatcher.setVolume(queue.volume / 10);
    }, 2000);
  }
}