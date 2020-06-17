const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");

module.exports = {
  name: "q",
  description: "Show the music queue and now playing.",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply("I am not in voice channel");

    const description = queue.songs.map((song, index) => `${index + 1}. ${escapeMarkdown(song.title)}`);

    let embed = new MessageEmbed()
      .setColor(0xB6EB7A)
      .setTitle("NOW PLAYING")
      .setAuthor("BBUMWHALE", "https://cdn.discordapp.com/attachments/717374154701144126/720535227151155240/Bbummochi_ProfilePhoto.jpg")
      .setDescription(description)
      .setTimestamp()
      .setFooter("Made by hsmint", "https://cdn.discordapp.com/attachments/717374154701144126/720535227151155240/Bbummochi_ProfilePhoto.jpg")

    const split = splitMessage(description, {
      maxLength: 2048,
      char: "\n",
      prepend: "",
      append: ""
    });

    split.forEach(async (m) => {
      embed.setDescription(m);
      message.channel.send(embed);
    });
  }
};