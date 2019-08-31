const request = require("request");
const cheerio = require("cheerio");
const { limitString, getHeaders } = require("../../utils");

const runner = () =>
  new Promise((resolve, reject) => {
    let WOTDTitle = "";
    let attribute = "";
    let syllables = "";
    const definitionAndFacts = [];
    const exampleWords = [];
    const italicWordsDidYouKnow = [];
    const italicWordsExamples = [];

    const options = {
      url: "https://www.merriam-webster.com/word-of-the-day",
      headers: getHeaders()
    };

    request(options, (error, response, data) => {
      if (error) {
        reject(error);
      }

      const $ = cheerio.load(data);

      WOTDTitle = $(".word-and-pronunciation h1")
        .text()
        .trim();

      attribute = $(".main-attr")
        .text()
        .trim();

      syllables = $(".word-syllables")
        .text()
        .trim();

      $(".wod-definition-container p").each((index, element) => {
        const text = $(element)
          .text()
          .trim();

        definitionAndFacts.push(text);
      });

      $(".wotd-examples p").each((index, element) => {
        const text = $(element)
          .text()
          .trim();

        exampleWords.push(text);
      });

      $(".left-content-box em").each((index, element) => {
        const text = $(element)
          .text()
          .trim();

        italicWordsDidYouKnow.push(text);
      });

      $(".wotd-examples em").each((index, element) => {
        const text = $(element)
          .text()
          .trim();

        italicWordsExamples.push(text);
      });

      const actualDefinitionAndFacts = definitionAndFacts.slice(
        0,
        definitionAndFacts.length - 3
      );

      const wordDefinition = definitionAndFacts.slice(
        0,
        definitionAndFacts.length - 4
      );

      const newItalicWordsDidYouKnow = actualDefinitionAndFacts[
        actualDefinitionAndFacts.length - 1
      ]
        .split(" ")
        .map((text, index) => {
          let newText = text;

          italicWordsDidYouKnow.forEach((_text, _index) => {
            if (text === _text) {
              newText = `_${text}_`;
            }
          });

          return newText;
        })
        .join(" ");

      const newItalicWordsExamples = exampleWords.map(sentence => {
        return sentence
          .split(" ")
          .map(text => {
            let newText = text;

            italicWordsExamples.forEach(_text => {
              if (text === _text) {
                newText = `_${text}_`;
              }
            });

            return newText;
          })
          .join(" ");
      });

      let formattedWordDefinition = "";
      wordDefinition.forEach(sentence => {
        formattedWordDefinition += `${sentence}

`;
      });

      let formattedWordExamples = "";
      newItalicWordsExamples.forEach((sentence, index) => {
        formattedWordExamples += `${index + 1}. ${sentence}

`;
      });

      resolve({
        title: `${WOTDTitle.charAt(0).toUpperCase()}${WOTDTitle.slice(1)}`,
        syllables,
        attribute,
        definition: formattedWordDefinition,
        examples: formattedWordExamples,
        info: newItalicWordsDidYouKnow
      });
    });
  });

const render = wotd => {
  const wordings = `- :regional_indicator_w: :regional_indicator_o: :regional_indicator_t: :regional_indicator_d:  -

    **${wotd.title}** [**${wotd.syllables}**]
    (_${wotd.attribute}_)
            
    **Definition**
    ${wotd.definition}
    **Example**
    ${wotd.examples}
    **Did you know?**
    ${wotd.info}`;

  return limitString(wordings, 2000);
};

module.exports = {
  runner,
  render,
  name: "wotd",
  description: "Get The Word of The Day",
  devOnly: true,
  async execute(message, args) {
    const wotd = await runner();

    return message.channel.send(render(wotd));
  }
};
