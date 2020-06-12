module.exports = {
  name: "volume",
  description: "Information about connection on Bot status",
  execute(msg, args) {
    const queue = msg.client.queue.get(msg.guild.id); // Getting info
    const embed = msg.client.msgEmbed;
    embed.title = "Volume";

    // Client not in voice channel
    if (!msg.member.voice) return msg.reply("You need to join voice channel!");
    
    // Bot not in voice channel
    if (!queue) return msg.reply("I need to join in voice channel first");

    // No songs are playing in voice channel
    if (!queue.status) return msg.channel.send("There is no songs playing");

    // Wants to know the volume
    if (!args[0]) {
      embed.description = `Current volume **${queue.volume}**`;
      return msg.channel.send({embed: embed});
    }

    // Change volume (0 ~ 10)
    if (args.length === 1 && (args[0] >= '0' && args[0] <= '10')) {
      const newVolume = args[0];
      embed.description = `Change volume **${queue.volume}** to **${newVolume}**`;
      msg.channel.send({embed: embed});
      queue.connection.dispatcher.setVolume(newVolume / 10);
      queue.volume = newVolume;
    }
  }
}