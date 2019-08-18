const svg2img = require("svg2img");
const { sendErrorMessage } = require("../../utils");

const baseURI = "https://joeschmoe.io/api/v1/";

module.exports = {
  baseURI,
  name: "face",
  description: "Your friend's avatar face",
  args: true,
  usage: "albert einstein",
  cooldown: 3,
  execute(message, args) {
    const normalizedArgs = encodeURIComponent(args.join(" "));

    const imageSource = `${baseURI}${normalizedArgs}`;

    svg2img(imageSource, (error, buffer) => {
      if (error) {
        return sendErrorMessage(message);
      }

      message.channel.send(`Here is ${args.join(" ")}'s face`, {
        files: [{ attachment: buffer }]
      });
    });
  }
};
