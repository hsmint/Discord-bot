const { msgSend } = require('../function/message');

module.exports = {
  name: "volume",
  description: "Information about connection on Bot status",
  execute(msg, args) {
    const queue = msg.client.queue.get(msg.guild.id); // Getting info

    // Client not in voice channel
    if (!msg.member.voice) return msg.reply("You need to join voice channel!");

    // Bot not in voice channel
    if (!queue) return msg.reply("I need to join in voice channel first");

    // No songs are playing in voice channel
    if (!queue.status) return msg.channel.send("There is no songs playing");

    // Wants to know the volume
    if (!args[0]) {
      return msgSend(msg, 'Volume', `Current volume **${queue.volume}**`);
    }

    // Change volume (0 ~ 10)
    if (args.length === 1) {
      const newVolume = Number(args[0]);
      if (newVolume >= 0 && newVolume <= 10) {
        try {
          const oldVolume = queue.volume;
          queue.volume = newVolume;
          queue.connection.dispatcher.setVolume(newVolume / 10);
          msgSend(msg, 'Volume', `Change volume **${oldVolume}** to **${newVolume}**`);
        } catch (error) {
          msgSend(msg, 'Volume', 'Not playing any song');
        }
      } else {
        msgSend(msg, 'Volume', 'Please send input 0 to 10');
      }
    }
  }
}