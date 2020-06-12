module.exports = {
  name: "ping",
  description: "Information about connection on Bot status",
  execute(msg) {
    const msgEmbed = msg.client.msgEmbed;
    msgEmbed.title = "Ping";
    msgEmbed.description = "Pong";
    msg.channel.send({embed: msgEmbed});
  }
}