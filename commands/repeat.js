const { msgSend } = require('../function/message');

module.exports = {
  name: "repeat",
  description: "Repeat the playlist",
  execute(msg) {
    const queue = msg.client.queue.get(msg.guild.id);

    // Client not in voice channel
    if (!msg.member.voice) msg.reply("You are not in voice channel");

    // Bot not in voice channel
    if (!queue) msg.reply("I am not in voice channel");

    // Change repeat status
    if (!queue.repeat) {
      queue.repeat = true;
      msgSend(msg, "Repeat", "Enable repeating the playlist");
    } else {
      queue.repeat = false;
      msgSend(msg, "Repeat", "Disable repeating the playlist.");
    }
  }
}