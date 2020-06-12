module.exports = {
  name: "leave",
  description: "Leaving voice channel",
  async execute(msg) {
    const queue = msg.client.queue.get(msg.guild.id);
    
    // Client not in voice channel
    if (!msg.member.voice) return msg.reply("You are not in voice channel");
    
    // Bot not in voice channel
    if (!queue) return msg.reply("I am not in voice channel");
    
    // Leaving channel
    msg.client.queue.delete(msg.guild.id);
    await msg.member.voice.channel.leave();
    msg.channel.send(`Leaving channel **${msg.member.voice.channel.name}**`);
  }
}