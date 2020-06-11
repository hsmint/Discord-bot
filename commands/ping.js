const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = {
  name: "ping",
  description: "Information about connection on Bot status",
  execute(msg) {
    const file = new MessageAttachment('../assets/bbummochi.jpg');
    const msgEmbed = new MessageEmbed()
      .setAuthor("Bumgolae","https://cdn.discordapp.com/attachments/717374154701144126/720535227151155240/Bbummochi_ProfilePhoto.jpg")
      .setDescription("Pong")
      .setTitle("Ping")
      .setTimestamp()
      .setFooter("Made By hsmint", "https://cdn.discordapp.com/attachments/717374154701144126/720535227151155240/Bbummochi_ProfilePhoto.jpg")
    msg.channel.send(msgEmbed);
  }
}