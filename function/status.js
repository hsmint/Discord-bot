export function isJoined(msg) {
  const queue = msg.client.queue.get(msg.guild.id);

  //User not in voice channel
  if (!msg.member.voice.channel) {
    msg.reply('You are not in voice channel');
    return false;
  }
  //Bot not in voice channel
  else if (!queue) {
    msg.reply('I am not in voice channel');
    return false;
  }

  return true;
}