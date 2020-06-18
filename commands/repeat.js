const { msgSend } = require('../function/message');

module.exports = {
  name: "repeat",
  description: "Repeat the playlist",
  execute(msg) {
    const queue = msg.client.queue.get(msg.guild.id);

    if (!msg.member.voice) msg.reply("You are not in voice channel");

    if (!queue) msg.reply("I am not in voice channel");

    if (!queue.repeat) {
      queue.repeat = true;
      msgSend(msg, "Repeat", "Repeating the playlist");
    } else {
      queue.repeat = false;
      msgSend(msg, "Repeat", "No repeating the playlist.");
    }
  }
}