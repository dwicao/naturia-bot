const request = require("request");
const cheerio = require("cheerio");
const { RichEmbed } = require("discord.js");
const { prefix } = require("../../config");
const { limitString, getHeaders } = require("../../utils");

module.exports = {
  name: "urban",
  description: "Search and return Urban Dictionary definition",
  args: true,
  usage: `normies`,
  execute(message, args) {
    const url = `https://www.urbandictionary.com/define.php?term=${encodeURIComponent(
      args.join(" ")
    )}`;

    const options = {
      url,
      headers: getHeaders()
    };

    request(options, (error, response, data) => {
      const $ = cheerio.load(data);

      const definition = $(".meaning")
        .first()
        .text()
        .trim();

      const example = $(".example")
        .first()
        .text()
        .trim();

      const embed = new RichEmbed()
        .setColor(`RANDOM`)
        .setTitle(`Meaning of ${args.join(" ")}`)
        .setDescription(limitString(definition, 2048))
        .addField("Example(s)", limitString(example, 1024), true);

      message.channel.send(embed);
    });
  }
};
