const { Client, Collection } = require('discord.js');

module.exports = class extends Client {
  constructor(config) {
    super({
      disableMentions: 'everyone'
    });
    
    this.commands = new Collection();
    this.queue = new Map();
    this.config = config;
    
    this.msgEmbed = {
      color: 0xB6EB7A,
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
  }
}