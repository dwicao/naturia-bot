const { RichEmbed } = require("discord.js");
const request = require("request");
const cheerio = require("cheerio");
const { getHeaders } = require("../../utils");

const runner = () =>
  new Promise((resolve, reject) => {
    const options = {
      url: "https://www.japanesepod101.com/japanese-phrases",
      headers: getHeaders()
    };

    request(options, (error, response, data) => {
      if (error) {
        reject(error);
      }

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

      resolve({
        image: pictureSource,
        kana,
        romaji,
        english,
        englishClass,
        exampleKana,
        exampleRomaji,
        exampleEnglish
      });
    });
  });

module.exports = {
  runner,
  name: "jwotd",
  description: "Japanese Word of The Day",
  async execute(message, args) {
    const jWOTD = await runner();

    const renderMainSection = () => `${jWOTD.kana}
${jWOTD.romaji}
${jWOTD.english} (${jWOTD.englishClass})`;

    const renderExamples = () => {
      let result = "";

      for (let i = 0; i < jWOTD.exampleKana.length; i++) {
        result += `${(jWOTD.exampleKana[i] || "").trim()}
${(jWOTD.exampleRomaji[i] || "").trim()}
${(jWOTD.exampleEnglish[i] || "").trim()}

`;
      }

      return result;
    };

    const embeddedWOTD = new RichEmbed()
      .setColor(`RANDOM`)
      .setThumbnail(jWOTD.image)
      .addField("Japanese Word of the Day", renderMainSection(), true)
      .addBlankField(true)
      .addField("Example", renderExamples(), true);

    return message.channel.send(embeddedWOTD);
  }
};
