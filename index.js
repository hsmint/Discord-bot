const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { Music } = require('./player/music.js');
const { token } = require('./config/bot.json');

client = new Client({ intents: [
	GatewayIntentBits.Guilds, 
	GatewayIntentBits.GuildVoiceStates
] });

global.player = new Music(client, {
		ytdlOptions: {
			quality: 'highestaudio',
			highWaterMark: 1 << 25,
		}
	})
	.on('botDisconnect', (queue) => queue.metadata.channel.send(`👋 | Bye!`))
	.on('trackEnd', (queue, track) =>  {
		queue.metadata.channel.send(`Music **${track.title}** ended!`);

		if (queue.tracks.length != 0) {
			queue.play(queue.tracks.at(0));
			return queue.metadata.channel.send(`Play next track **${queue.tracks.at(0)}**`)
		} else {
			return queue.metadata.channel.send('All the track plays are finished!');
		}
	})

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});
	/**
     * @param {Interaction} interaction
     */
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);