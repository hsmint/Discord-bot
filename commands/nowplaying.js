const { msgEmbed } = require('../function/message');

module.exports = {
  name: "np",
  description: "Show playlist",
  execute(msg) {
    const queue = msg.client.queue.get(msg.guild.id);
    if (!msg.member.voice) return msg.reply("You are not in voice channel");

    if (!queue) return msg.reply("I am not in voice channel");

    if (!queue.status) return;
    
    const nowPlaying = msgEmbed("Now Playing", `**${queue.songs[0].title}**\n${queue.songs[0].url}`);
    msg.channel.send({embed: nowPlaying});
  }
}