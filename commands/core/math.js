const { RichEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "math",
  description: "Evaluate math operation",
  args: true,
  usage: "8 * 2 (3+7)",
  async execute(message, args) {
    let result = "";

    await fetch(
      `https://api.mathjs.org/v4/?expr=${encodeURIComponent(args.join(""))}`
    )
      .then(res => res.text())
      .then(response => {
        result = response;
      })
      .catch(console.error);

    const embed = new RichEmbed()
      .setColor(`RANDOM`)
      .setDescription(`${args.join(" ")} = ${result}`);

    message.channel.send(embed);
  }
};
