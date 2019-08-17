const { RichEmbed } = require("discord.js");

module.exports = {
  name: "radio",
  description: "Streaming an anime radio",
  execute(message, args) {
    if (!message.member.voiceChannel) {
      const embed = new RichEmbed()
        .setColor("#ff0000")
        .setDescription("You must be in a Voice channel to use this command!");

      return message.channel.send(embed);
    }

    return message.member.voiceChannel
      .join()
      .then(connection => {
        connection.playStream(
          "https://coderadio-relay.freecodecamp.org/radio/8010/radio.mp3",
          {
            bitrate: 192000 /* 192kbps */
          }
        );

        const embed = new RichEmbed()
          .setColor("#68ca55")
          .setDescription(
            `Now playing music in ${message.member.voiceChannel}`
          );

        return message.channel.send(embed);
      })
      .catch(err => {
        const embed = new RichEmbed().setColor("#ff0000").setDescription(err);

        return message.channel.send(embed);
      });
  }
};
