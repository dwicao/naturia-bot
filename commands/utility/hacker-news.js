const request = require("request");
const cheerio = require("cheerio");
const { RichEmbed } = require("discord.js");
const { getHeaders, sendErrorMessage } = require("../../utils");

const runner = () =>
  new Promise((resolve, reject) => {
    const url = "https://news.ycombinator.com";

    const options = {
      url,
      headers: getHeaders()
    };

    request(options, (error, response, data) => {
      const titles = [];

      const $ = cheerio.load(data);

      const title = $(".storylink");

      title.each((i, element) => {
        const text = $(element).text();
        const href = $(element).attr("href");
        const link = href.startsWith("item?id=") ? `${url}/${href}` : href;

        titles.push({
          text,
          link
        });
      });

      if (error) {
        reject(error);
      } else {
        resolve(titles);
      }
    });
  });

const render = titles => {
  let partOne = "";
  let partTwo = "";

  titles.slice(0, 15).forEach((title, index) => {
    partOne += `${index + 1}. [${title.text}](${title.link})\n\n`;
  });

  titles.slice(15, 30).forEach((title, index) => {
    partTwo += `${index + 16}. [${title.text}](${title.link})\n\n`;
  });

  return {
    partOne,
    partTwo
  };
};

module.exports = {
  runner,
  render,
  name: "hacker-news",
  description: "Generate a list posts from Hacker News",
  aliases: ["hn"],
  cooldown: 60,
  async execute(message, args) {
    const titles = await runner();

    const embedOne = new RichEmbed()
      .setColor(`#ff6600`)
      .setTitle("Hacker News Today")
      .setDescription(render(titles).partOne);

    const embedTwo = new RichEmbed()
      .setColor(`#ff6600`)
      .setDescription(render(titles).partTwo);

    message.channel.send(embedOne);
    return message.channel.send(embedTwo);
  }
};
