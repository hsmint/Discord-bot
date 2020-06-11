const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const Client = require('./client/Client');

const bot = new Client();
bot.commands = new Discord.Collection();

const cmdFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of cmdFiles) {
	const cmd = require(`./commands/${file}`);
	bot.commands.set(cmd.name, cmd);
}

bot.on('message', msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).split(/ +/);
	const cmdName = args.shift().toLowerCase();

	if (!bot.commands.has(cmdName)) return;
  const cmd = bot.commands.get(cmdName);

  try {
    if (msg.channel.name === "music") cmd.execute(msg, args);
  } catch (error) {
    console.error(error);
    msg.reply("There was an error trying to execute that command!");
  }
})

bot.login(token);

bot.on('ready', msg => {
  bot.user.setActivity(`Constructing`, {type: "PLAYING"});
  console.log(`Logged in as ${bot.user.tag}!`);
});