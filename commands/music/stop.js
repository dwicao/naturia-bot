module.exports = {
  name: "stop",
  aliases: ["dc", "disconnect", "fuckoff", 'leave'],
  description: "Leave a voice channel",
  execute(message, args) {
    return message.guild.voiceConnection.disconnect();
  }
};
