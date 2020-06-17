const { MessageEmbed } = require('discord.js');

module.exports = {
  msgSend(msg, title, txt) {
    const embed = new MessageEmbed()
      .setColor(0xB6EB7A)
      .setTitle(title)
      .setAuthor("BBUMWHALE", "https://cdn.discordapp.com/attachments/717374154701144126/720535227151155240/Bbummochi_ProfilePhoto.jpg")
      .setDescription(txt)
      .setTimestamp()
      .setFooter("Made by hsmint", "https://cdn.discordapp.com/attachments/717374154701144126/720535227151155240/Bbummochi_ProfilePhoto.jpg")
    
    msg.channel.send(embed);
  },
  msgEmbed(title, txt) {
    let embed = {
      color: 0xB6EB7A,
      title: title,
      description: txt,
      author: {
        name: "BBUMWHALE",
        icon_url: "https://cdn.discordapp.com/attachments/717374154701144126/720535227151155240/Bbummochi_ProfilePhoto.jpg",
      },
      timestamp: new Date(),
      footer: {
        text: 'Made by hsmint',
        icon_url: "https://cdn.discordapp.com/attachments/717374154701144126/720535227151155240/Bbummochi_ProfilePhoto.jpg",
      }
    }
    return embed;
  }
}