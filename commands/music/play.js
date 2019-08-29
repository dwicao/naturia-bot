const { RichEmbed } = require("discord.js");

module.exports = {
  name: "play",
  description: "24/7 music designed for coding.",
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
          "https://coderadio-admin.freecodecamp.org/radio/8010/low.mp3",
          {
            bitrate: 64000 /* 64kbps */
          }
        );

        const embed = new RichEmbed()
          .setColor("#68ca55")
          .setDescription(
            `Enjoy 24/7 music designed for coding in ${message.member.voiceChannel}`
          );

        return message.channel.send(embed);
      })
      .catch(err => {
        const embed = new RichEmbed().setColor("#ff0000").setDescription(err);

        return message.channel.send(embed);
      });
  }
};
