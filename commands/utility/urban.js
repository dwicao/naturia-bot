const request = require("request");
const cheerio = require("cheerio");
const { RichEmbed } = require("discord.js");
const { limitString, getHeaders } = require("../../utils");

const runner = term =>
  new Promise((resolve, reject) => {
    const url = `https://www.urbandictionary.com/define.php?term=${encodeURIComponent(
      term
    )}`;

    const options = {
      url,
      headers: getHeaders()
    };

    request(options, (error, response, data) => {
      if (error) {
        reject(error);
      }

      const $ = cheerio.load(data);

      const definition = $(".meaning")
        .first()
        .text()
        .trim();

      const example = $(".example")
        .first()
        .text()
        .trim();

      resolve({
        definition,
        example
      });
    });
  });

module.exports = {
  runner,
  name: "urban",
  description: "Search and return Urban Dictionary definition",
  args: true,
  usage: `normies`,
  async execute(message, args) {
    const result = await runner(args.join(" "));

    const embed = new RichEmbed()
      .setColor(`RANDOM`)
      .setTitle(`Meaning of ${args.join(" ")}`)
      .setDescription(limitString(result.definition, 2048))
      .addField("Example(s)", limitString(result.example, 1024), true);

    message.channel.send(embed);
  }
};
