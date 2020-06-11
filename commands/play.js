const fs = require('fs');
const ytdl = require('ytdl-core');

module.exports = {
  name: "play",
  description: "Playing a song on voice channel",
  async execute(msg, args) {

    const queue = msg.client.queue.get(msg.guild.id);
    const voiceChannel = msg.member.voice.channel;

    // Client not in voice channel
    if (!voiceChannel) return msg.reply('You are not in voice channel');

    // Playing music
    if (args.length === 1) {
      // Getting song info from youtube
      const songInfo = await ytdl.getInfo(args[0]);
      const song = {
        title: songInfo.title,
        url: songInfo.video_url,
      };

      // If setting up data is already done before
      if (queue) {
        // There is no song playing
        if (queue.status === "stopped") return play(song);

        // Playing song in voice channel
        else {
          queue.songs.push(song);
          return msg.channel.send(`Added **${song.title}**`);
        }
      }

      // Constructing data
      const data = {
        connection: null,
        volume: 5,
        songs: [],
        status: "playing"
      };

      msg.client.queue.set(msg.guild.id, data);
      data.songs.push(song);

      // Function to donwload song and play
      const play = async song => {
        const queue = msg.client.queue.get(msg.guild.id);
        const message = await msg.channel.send("Downloading Music...");
        queue.status = "playing";
        ytdl(song.url, {filter: 'audioonly', quality: 'highestaudio'}).pipe(fs.createWriteStream(`./assets/song${msg.guild.id}.webm`));
        setTimeout(() => {
          const dispatcher = queue.connection.play(`./assets/song${msg.guild.id}.webm`)
            .on('finish', () => {
              queue.songs.shift();
              if (!queue.songs[0]) dispatcher.end();
              else play(queue.songs[0]);
            })
            .on('error', error => console.log(error));
          dispatcher.setVolume(queue.volume / 10);
          message.edit(`Playing **${queue.songs[0].title}**`);
        }, 2000);
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
  }
}