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
    if (queue.status === "stopped") return msg.channel.send("I am not playing anything");

    // Playing a song
    queue.status = "paused";
    queue.connection.dispatcher.pause();
    msg.channel.send("Paused music");
  }
}