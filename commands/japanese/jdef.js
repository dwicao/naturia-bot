const { RichEmbed } = require("discord.js");
const request = require("request");
const cheerio = require("cheerio");
const { prefix } = require("../../config");
const { getHeaders } = require("../../utils");

module.exports = {
  name: "jdefinition",
  description: "Words definition (Japanese - English) or vice-versa",
  args: true,
  aliases: ["jdef"],
  usage: `Good Morning or ${prefix}jdef Ohayou`,
  async execute(message, args) {
    const _arguments = args.length > 1 ? args.join("%20") : args[0];

    const url = `http://www.romajidesu.com/dictionary/meaning-of-${_arguments}.html`;

    const options = {
      url,
      headers: getHeaders()
    };

    request(options, (error, response, data) => {
      const $ = cheerio.load(data);

      const romajiElements = $(".word_kana")
        .text()
        .trim();
      const romajiConvoluted = romajiElements.split(/\s/g);
      const romajiCollection = romajiConvoluted.filter(
        value => value && value !== "·"
      );
      const romajiResults = romajiCollection.slice(0, 5);

      const meaningsElements = $(".word_meanings")
        .text()
        .trim();
      const meaningsConvoluted = meaningsElements.split(/\s/g);
      const meaningsCollection = meaningsConvoluted.filter(value => value);

      const exampleJapaneseIndexes = [];
      const exampleJapanese = meaningsCollection.filter((value, index) => {
        if (value.includes("。")) {
          exampleJapaneseIndexes.push(index);
          return true;
        }
        return false;
      });

      const exampleFirstEnglishWordIndexes = [];
      const exampleFirstEnglishWord = meaningsCollection.filter(
        (value, index) => {
          if (value.includes("(")) {
            exampleFirstEnglishWordIndexes.push(index);
            return true;
          }
          return false;
        }
      );

      const firstDefinitionEnglish = meaningsCollection
        .slice(0, exampleJapaneseIndexes[0])
        .join(" ");
      const firstDefinitionJapanese = exampleJapanese[0];
      const firstDefinitionJapaneseMeans = meaningsCollection
        .slice(exampleJapaneseIndexes[0] + 1, exampleFirstEnglishWordIndexes[1])
        .join(" ");

      const cleanRelatedWords = words => {
        const arrowIndex = words.indexOf("→");
        if (arrowIndex !== -1) {
          return words.slice(0, arrowIndex - 1);
        }
        return words || "";
      };

      const title = `Results of _${args.join(" ")}_ in Japanese`;

      const renderResults = () => {
        let result = "";
        romajiResults.forEach(value => {
          result += `${value.replace("(", " (")}
`;
        });
        return result;
      };

      const renderMeaning = () => cleanRelatedWords(firstDefinitionEnglish);

      const renderExamples = () => {
        return `${firstDefinitionJapanese || ""}
${cleanRelatedWords(firstDefinitionJapaneseMeans)}`;
      };

      const embeddedDefinition = new RichEmbed()
        .setColor(`RANDOM`)
        .addField(title, renderResults(), true)
        .addField("Meaning", renderMeaning(), true)
        .addField("Example", renderExamples(), true);

      return message.channel.send(embeddedDefinition);
    });
  }
};
