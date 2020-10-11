const { msgSend } = require('../function/message');

module.exports = {
  name: "skip",
  description: "Skip to next song",
  execute(msg) {
    const queue = msg.client.queue.get(msg.guild.id);
    
    // Client not in voice channel
    if (!msg.member.voice) return msg.reply("You are not in voice channel");
    
    // Bot not in voice channel
    if (!queue) return msg.reply("I am not in voice channel");

    // Currently not playing
    if (!queue.status) return msg.channel.send("I am not playing anything");

    // Skipping song
    queue.connection.dispatcher.end();
    msgSend(msg, 'Skip', `Skipping ${queue.songs[0].title}`);
  }
}