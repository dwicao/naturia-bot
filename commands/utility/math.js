const { RichEmbed } = require("discord.js");
const fetch = require("node-fetch");

const runner = expr =>
  fetch(`https://api.mathjs.org/v4/?expr=${encodeURIComponent(expr)}`)
    .then(res => res.text())
    .then(response => response);

module.exports = {
  runner,
  name: "math",
  description: "Evaluate math operation",
  args: true,
  usage: "8 * 2 (3+7)",
  async execute(message, args) {
    const result = await runner(args.join(""));

    const embed = new RichEmbed()
      .setColor(`RANDOM`)
      .setDescription(`${args.join(" ")} = ${result}`);

    return message.channel.send(embed);
  }
};
