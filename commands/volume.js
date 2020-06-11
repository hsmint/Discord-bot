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
    if (queue.status === "stopped") return msg.channel.send("There is no songs playing");

    // Wants to know the volume
    if (!args[0]) return msg.channel.send(`Current volume **${queue.volume}**`);

    // Change volume (0 ~ 10)
    if (args.length === 1 && (args[0] >= '0' && args[0] <= '10')) {
      const newVolume = args[0];
      msg.channel.send(`Change volume **${queue.volume}** to **${newVolume}**`);
      queue.connection.dispatcher.setVolume(newVolume / 10);
      queue.volume = newVolume;
    }
  }
}