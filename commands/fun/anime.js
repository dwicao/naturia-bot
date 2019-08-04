const request = require("request");
const cheerio = require("cheerio");
const { RichEmbed } = require("discord.js");
const { limitString } = require("../../utils");

module.exports = {
  name: "anime",
  description: "Generate a random anime info",
  execute(message, args) {
    const MIN = 0;
    const MAX = 1270;
    const randNum = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;

    const URI = `https://www.randomanime.org/shows/${randNum}/`;

    request(URI, (error, response, data) => {
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

      const thumbnailSrc = `https://www.randomanime.org/images/shows/${randNum}/anime-l.jpg`;

      const TITLE = "Random Anime Info";

      const renderMainSection = () => {
        let result = "";
        for (
          let indexDetails = 0;
          indexDetails < details.length;
          indexDetails += 1
        ) {
          result += `${details[indexDetails]}
  `;
        }
        return result;
      };

      const embeddedDefinition = new RichEmbed()
        .setColor(`RANDOM`)
        .attachFiles([thumbnailSrc])
        .addField(TITLE, renderMainSection(), true)
        .addField("Description", limitString(description, 1024), true);

      message.channel.send(embeddedDefinition);
    });
  }
};
