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
  let partThree = "";

  titles.slice(0, 10).forEach((title, index) => {
    partOne += `${index + 1}. [${title.text}](${title.link})\n\n`;
  });

  titles.slice(10, 20).forEach((title, index) => {
    partTwo += `${index + 11}. [${title.text}](${title.link})\n\n`;
  });

  titles.slice(20, titles.length).forEach((title, index) => {
    partThree += `${index + 21}. [${title.text}](${title.link})\n\n`;
  });

  return {
    partOne,
    partTwo,
    partThree
  };
};

const getEmbeds = titles => {
  return {
    one: new RichEmbed()
      .setColor(`#ff6600`)
      .setTitle("Hacker News Today")
      .setDescription(render(titles).partOne),

    two: new RichEmbed()
      .setColor(`#ff6600`)
      .setDescription(render(titles).partTwo),

    three: new RichEmbed()
      .setColor(`#ff6600`)
      .setDescription(render(titles).partThree)
      .setFooter("Hacker News", "https://news.ycombinator.com/y18.gif")
      .setTimestamp()
  };
};

module.exports = {
  runner,
  render,
  getEmbeds,
  name: "hacker-news",
  description: "Get list of posts in homepage from Hacker News",
  aliases: ["hn"],
  cooldown: 60,
  async execute(message, args) {
    const titles = await runner();

    message.channel.send(getEmbeds(titles).one);
    message.channel.send(getEmbeds(titles).two);
    return message.channel.send(getEmbeds(titles).three);
  }
};
