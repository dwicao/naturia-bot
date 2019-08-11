const { RichEmbed } = require("discord.js");
const request = require("request");
const cheerio = require("cheerio");
const { getHeaders } = require("../../utils");

module.exports = {
  name: "jwotd",
  description: "Japanese Word of The Day",
  devOnly: true,
  execute(message, args) {
    const options = {
      url: "https://www.japanesepod101.com/japanese-phrases",
      headers: getHeaders()
    };

    request(options, (error, response, data) => {
      const $ = cheerio.load(data);

      const pictureSource = $(".r101-wotd-widget__image").attr("src");

      // First Section
      const kana = $(
        ".r101-wotd-widget__section--first .r101-wotd-widget__additional-field.kana"
      )
        .text()
        .trim();
      const romaji = $(
        ".r101-wotd-widget__section--first .r101-wotd-widget__additional-field.romaji"
      )
        .text()
        .trim();
      const english = $(
        ".r101-wotd-widget__section--first .r101-wotd-widget__english"
      )
        .text()
        .trim();
      const englishClass = $(".r101-wotd-widget__class")
        .text()
        .trim();

      // Second Section
      const exampleKana = $(
        ".r101-wotd-widget__section .r101-wotd-widget__additional-field.kana"
      )
        .text()
        .trim()
        .split("\n");
      const exampleRomaji = $(
        ".r101-wotd-widget__section .r101-wotd-widget__additional-field.romaji"
      )
        .text()
        .trim()
        .split("\n");
      const exampleEnglish = $(
        ".r101-wotd-widget__section .r101-wotd-widget__english"
      )
        .text()
        .trim()
        .split(".");

      // rendering
      const renderMainSection = () => `${kana}
${romaji}
${english} (${englishClass})`;

      const renderExamples = () => {
        let result = "";

        for (let i = 0; i < exampleKana.length; i++) {
          result += `${(exampleKana[i] || "").trim()}
${(exampleRomaji[i] || "").trim()}
${(exampleEnglish[i] || "").trim()}

`;
        }

        return result;
      };

      const embeddedWOTD = new RichEmbed()
        .setColor(`RANDOM`)
        .setThumbnail(pictureSource)
        .addField("Japanese Word of the Day", renderMainSection(), true)
        .addBlankField(true)
        .addField("Example", renderExamples(), true);

      return message.channel.send(embeddedWOTD);
    });
  }
};
