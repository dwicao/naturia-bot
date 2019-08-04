const { RichEmbed } = require("discord.js");
const svg2img = require("svg2img");

module.exports = {
  name: "face",
  description: "Your friend's avatar face",
  args: true,
  usage: "albert einstein",
  cooldown: 3,
  execute(message, args) {
    const normalizedArgs = encodeURIComponent(args.join(" "));

    const imageSource = `https://joeschmoe.io/api/v1/${normalizedArgs}`;

    svg2img(imageSource, (error, buffer) => {
      if (error) {
        return message.channel.send("Fetching Error! Please Try Again.");
      }

      message.channel.send(`Here is ${args.join(" ")}'s face`, {
        files: [{ attachment: buffer }]
      });
    });
  }
};
