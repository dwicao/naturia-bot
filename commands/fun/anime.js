const request = require("request");
const cheerio = require("cheerio");
const { RichEmbed } = require("discord.js");
const { limitString, getHeaders } = require("../../utils");

const runner = () =>
  new Promise((resolve, reject) => {
    const MIN = 0;
    const MAX = 1270;
    const randNum = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;

    const options = {
      url: `https://www.randomanime.org/shows/${randNum}/`,
      headers: getHeaders()
    };

    request(options, (error, response, data) => {
      if (error) {
        reject(error);
      }

      const $ = cheerio.load(data);

      const descriptionResult = $("[itemprop=about]")
        .text()
        .trim();
      const cleanDescription = descriptionResult.replace("...Read More", "");
      const description = cleanDescription.replace("Read Less", "");

      const detailsCollection = [];
      const detailsResult = $(".quick-info-container .quick-info li").each(
        (i, element) => {
          detailsCollection.push($(element).text());
        }
      );
      const details = detailsCollection.slice(0, detailsCollection.length - 1);

      const thumbnail = `https://www.randomanime.org/images/shows/${randNum}/anime-l.jpg`;

      resolve({
        min: MIN,
        max: MAX,
        number: randNum,
        thumbnail,
        description,
        details
      });
    });
  });

module.exports = {
  runner,
  name: "anime",
  description: "Generate a random anime info",
  async execute(message, args) {
    const animeInfo = await runner();

    const renderMainSection = () => {
      let result = "";
      for (
        let indexDetails = 0;
        indexDetails < animeInfo.details.length;
        indexDetails += 1
      ) {
        result += `${animeInfo.details[indexDetails]}
`;
      }
      return result;
    };

    const embeddedDefinition = new RichEmbed()
      .setColor(`RANDOM`)
      .attachFiles([animeInfo.thumbnail])
      .addField("Random Anime Info", renderMainSection(), true)
      .addField("Description", limitString(animeInfo.description, 1024), true);

    message.channel.send(embeddedDefinition);
  }
};
