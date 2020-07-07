const { play } = require('../function/stream');
const { msgSend } = require('../function/message');

module.exports = {
  name: "replay",
  description: "Replay the song playing",
  execute(msg) {
    const queue = msg.client.queue.get(msg.guild.id)

    if (!msg.member.voice) return msg.reply("You are not in voice channel");

    if (!queue) return msg.reply("I am not in voice channel");

    play(msg);
    msgSend(msg, 'Replay', `Replaying **${queue.songs[0].title}**`);
  }
}