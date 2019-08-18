module.exports = {
  name: "stop",
  aliases: ["dc", "disconnect", "fuckoff", "leave"],
  description: "Leave a voice channel",
  execute(message, args) {
    const conn = message.guild.voiceConnection;
    if (conn) conn.disconnect();
  }
};
