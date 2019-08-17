module.exports = {
  name: "leave",
  aliases: ["dc", "disconnect", "leaves", "fuckoff"],
  description: "Leave a voice channel",
  execute(message, args) {
    return message.guild.voiceConnection.disconnect();
  }
};
