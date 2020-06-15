const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const Client = require('./client/Client');

//Change activity
module.exports = {
  changeActivity(msg) {
    const queue = msg.client.queue.get(msg.guild.id);
    if (queue) {
      if (queue.status) {
        if (queue.pause) bot.user.setActivity(`PAUSED`, {type: "PLAYING"});
        else bot.user.setActivity(`${queue.songs[0].title}`, {type: "LISTENING"});
      } else {
        bot.user.setActivity(`NO MUSIC`, {type: "PLAYING"});
      }
    } else {
      bot.user.setActivity(`NO MUSIC`, {type: "PLAYING"});
    }
  }
}

const bot = new Client();
bot.commands = new Discord.Collection();

const cmdFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of cmdFiles) {
	const cmd = require(`./commands/${file}`);
	bot.commands.set(cmd.name, cmd);
}

bot.on('message', async msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).split(/ +/);
	const cmdName = args.shift().toLowerCase();

	if (!bot.commands.has(cmdName)) return;
  const cmd = bot.commands.get(cmdName);

  try {
    if (msg.channel.name === "music") {
      await cmd.execute(msg, args);
      module.exports.changeActivity(msg);
    }
  } catch (error) {
    console.error(error);
    msg.reply("There was an error trying to execute that command!");
  }
})

bot.login(token);

bot.on('ready', msg => {
  bot.user.setActivity(`NO MUSIC`, {type: "PLAYING"});
  console.log(`Logged in as ${bot.user.tag}!`);
});