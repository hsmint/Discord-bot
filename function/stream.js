const ytdl = require('ytdl-core')
const fs = require('fs')
const { msgSend } = require('../function/message')
const { changeActivity } = require('../index')

module.exports = {
  async play(msg) {
    const queue = msg.client.queue.get(msg.guild.id)
    queue.status = true
    const song = queue.songs[0]
    try {
      await ytdl(song.url, {filter: 'audioonly', quality: 'highestaudio'}).pipe(fs.createWriteStream(`./assets/song${msg.guild.id}.webm`))
      const dispatcher = queue.connection.play(`./assets/song${msg.guild.id}.webm`)
      .on('finish', () => {
        if (queue.repeat) queue.songs.push(queue.songs[0])
        queue.songs.shift()
        if (!queue.songs[0]) {
          dispatcher.end()
          queue.songs = []
          queue.status = false
          changeActivity(msg)
        } else {
          changeActivity(msg)
          return module.exports.play(msg)
        }
      })
      dispatcher.setVolume(queue.volume / 10);
    } catch (error) {
      console.error(error)
      queue.songs.shift()
      if (!queue.songs[0]) {
        dispatcher.end()
        queue.songs = []
        queue.status = false
        changeActivity(msg)
      } else {
        msgSend(msg, 'Error', 'Cannot get video')
        return module.exports.play(msg)
      }
    }
  }
}