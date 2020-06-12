module.exports = {
  name: "pause",
  description: "Information about connection on Bot status",
  execute(msg) {
    const queue = msg.client.queue.get(msg.guild.id);
    
    // Client not in voice channel
    if (!msg.member.voice) return msg.reply("You are not in voice channel");
    
    // Bot not in voice channel
    if (!queue) return msg.reply("I am not in voice channel");

    // Currently not playing
    if (!queue.status) return msg.channel.send("I am not playing anything");

    // Playing a song
    if (!queue.pause){
      queue.connection.dispatcher.pause();
      queue.pause = true;
      const embed = msg.client.msgEmbed;
      embed.title = "Pause";
      embed.description = `Paused **${queue.songs[0].title}**`;
      msg.channel.send({embed: embed});
    }
  }
}