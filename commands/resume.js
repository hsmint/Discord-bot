module.exports = {
  name: "resume",
  description: "Information about connection on Bot status",
  execute(msg) {
    const queue = msg.client.queue.get(msg.guild.id);
    
    // Client not in voice channel
    if (!msg.member.voice) return msg.reply("You are not in voice channel");
    
    // Bot not in voice channel
    if (!queue) return msg.reply("I am not in voice channel");

    // Bot status set as stopped
    if (queue.status === "stopped") return msg.channel.send("I am not playing anything");

    // Bot status set as paused
    queue.status = "playing";
    queue.connection.dispatcher.resume();
    msg.channel.send(`Resuming **${queue.songs[0].title}**`);
  }
}