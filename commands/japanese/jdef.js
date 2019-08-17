const { RichEmbed } = require("discord.js");
const request = require("request");
const cheerio = require("cheerio");
const { prefix } = require("../../config");
const { getHeaders } = require("../../utils");

const runner = word =>
  new Promise((resolve, reject) => {
    const url = `http://www.romajidesu.com/dictionary/meaning-of-${encodeURIComponent(
      word
    )}.html`;

    const options = {
      url,
      headers: getHeaders()
    };

    request(options, (error, response, data) => {
      if (error) {
        reject(error);
      }

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

      resolve({
        romaji: romajiResults,
        englishDefinition: firstDefinitionEnglish,
        japaneseDefinition: firstDefinitionJapanese,
        japaneseMeans: firstDefinitionJapaneseMeans
      });
    });
  });

const cleanRelatedWords = words => {
  const arrowIndex = words.indexOf("→");
  if (arrowIndex !== -1) {
    return words.slice(0, arrowIndex - 1);
  }
  return words || "";
};

module.exports = {
  runner,
  name: "jdefinition",
  description: "Words definition (Japanese - English) or vice-versa",
  args: true,
  aliases: ["jdef"],
  usage: `Good Morning or ${prefix}jdef Ohayou`,
  async execute(message, args) {
    const jDef = await runner(args.join(" "));

    const title = `Results of _${args.join(" ")}_ in Japanese`;

    const renderResults = () => {
      let result = "";
      jDef.romaji.forEach(value => {
        result += `${value.replace("(", " (")}
`;
      });
      return result;
    };

    const renderMeaning = () => cleanRelatedWords(jDef.englishDefinition);

    const renderExamples = () => {
      return `${jDef.japaneseDefinition || ""}
${cleanRelatedWords(jDef.japaneseMeans)}`;
    };

    const embeddedDefinition = new RichEmbed()
      .setColor(`RANDOM`)
      .addField(title, renderResults(), true)
      .addField("Meaning", renderMeaning(), true)
      .addField("Example", renderExamples(), true);

    return message.channel.send(embeddedDefinition);
  }
};
