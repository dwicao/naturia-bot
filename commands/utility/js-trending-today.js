const request = require("request");
const cheerio = require("cheerio");
const { RichEmbed } = require("discord.js");
const { getHeaders, sendErrorMessage } = require("../../utils");

const runner = () =>
  new Promise((resolve, reject) => {
    const url = "https://github.com/trending/javascript?since=daily";

    const options = {
      url,
      headers: getHeaders()
    };

    request(options, (error, response, data) => {
      const titles = [];
      const links = [];
      const descriptions = [];
      const totalStars = [];
      const totalForks = [];
      const todayStars = [];

      const $ = cheerio.load(data);

      const titleElements = $(".h3.lh-condensed");
      const descriptionElements = $(".my-1");
      const totalStarAndForkElements = $(`a.muted-link.d-inline-block.mr-3`);
      const todayStarElements = $(`.float-sm-right`);
      const linkElements = $("h1.h3.lh-condensed a[href]");

      titleElements.each((i, element) => {
        const repoNames = $(element)
          .text()
          .replace(/\s/g, "");

        titles.push(repoNames);
      });

      linkElements.each((i, element) => {
        const href = $(element).attr("href");

        links.push(`https://github.com${href}`);
      });

      descriptionElements.each((i, element) => {
        const description = $(element)
          .text()
          .trim();

        descriptions.push(description);
      });

      totalStarAndForkElements.each((i, element) => {
        const _element = $(element)
          .text()
          .trim();

        if (i % 2 === 0) {
          totalStars.push(_element);
        } else {
          totalForks.push(_element);
        }
      });

      todayStarElements.each((i, element) => {
        const todayStarElement = $(element)
          .text()
          .trim();

        todayStars.push(todayStarElement);
      });

      if (error) {
        reject(error);
      } else {
        resolve({
          titles,
          links,
          descriptions,
          totalStars,
          totalForks,
          todayStars
        });
      }
    });
  });

const render = ({
  titles,
  links,
  descriptions,
  totalStars,
  totalForks,
  todayStars
}) => {
  const embedDescriptions = [];

  titles.forEach((title, i) => {
    const text = `${i + 1}. [${title}](${links[i]}) (${todayStars[i]}) \n ${
      descriptions[i]
    } \n :star:${totalStars[i]} :fork_and_knife:${totalForks[i]}`;

    embedDescriptions.push(text);
  });

  return embedDescriptions;
};

const getEmbeds = result => {
  const embedCollections = [];
  const embedDescriptions = render(result);

  embedDescriptions.forEach((text, index) => {
    embedCollections.push(
      new RichEmbed().setColor(`#ff6600`).setDescription(text)
    );
  });

  return embedCollections;
};

module.exports = {
  runner,
  render,
  getEmbeds,
  name: "javascript-trending",
  description: "Get list of trending Javascript repos in Github",
  aliases: ["jt"],
  devOnly: true,
  async execute(message, args) {
    const result = await runner();

    message.channel.send(
      new RichEmbed()
        .setColor(`#ff6600`)
        .setDescription(`**Trending Javascript Repositories Today**`)
    );

    render(result).forEach(value => {
      message.channel.send(
        new RichEmbed().setColor(`#008000`).setDescription(value)
      );
    });

    return message.channel.send(
      new RichEmbed()
        .setColor(`#ff6600`)
        .setTimestamp()
        .setFooter(`Source: Github Trending`)
    );
  }
};
