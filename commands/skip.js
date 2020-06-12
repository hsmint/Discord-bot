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
    const embed = msg.client.msgEmbed;
    embed.title = "Skip";
    embed.description = `Skipping **${queue.songs[0].title}**`;
    queue.connection.dispatcher.end();
    msg.channel.send({embed: embed});
  }
}