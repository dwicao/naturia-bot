const request = require('request');
const cheerio = require('cheerio');

let WOTDTitle = '';
let attribute = '';
let syllables = '';
let prounciation = [];
let definitionAndFacts = [];
let exampleWords = [];
let italicWordsDidYouKnow = [];
let italicWordsExamples = [];

module.exports = {
	name: 'wotd',
	description: 'Get The Word of The Day',
	execute(message, args) {
		request(
      'https://www.merriam-webster.com/word-of-the-day',
      (error, response, data) => {
        const $ = cheerio.load(data);

        WOTDTitle = $('.word-and-pronunciation h1')
          .text()
          .trim();

        attribute = $('.main-attr')
          .text()
          .trim();

        syllables = $('.word-syllables')
          .text()
          .trim();

        $('.wod-definition-container p').each((index, element) => {
          const text = $(element)
            .text()
            .trim();

          definitionAndFacts.push(text);
        });

        $('.wotd-examples p').each((index, element) => {
          const text = $(element)
            .text()
            .trim();

          exampleWords.push(text);
        });

        $('.left-content-box em').each((index, element) => {
          const text = $(element)
            .text()
            .trim();

          italicWordsDidYouKnow.push(text);
        });

        $('.wotd-examples em').each((index, element) => {
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
          .split(' ')
          .map((text, index) => {
            let newText = text;

            italicWordsDidYouKnow.forEach((_text, _index) => {
              if (text === _text) {
                newText = `_${text}_`;
              }
            });

            return newText;
          })
          .join(' ');

        const newItalicWordsExamples = exampleWords.map((sentence, index) => {
          return sentence
            .split(' ')
            .map((text, index) => {
              let newText = text;

              italicWordsExamples.forEach((_text, _index) => {
                if (text === _text) {
                  newText = `_${text}_`;
                }
              });

              return newText;
            })
            .join(' ');
        });

        let formattedWordDefinition = '';
        wordDefinition.forEach((sentence, index) => {
          formattedWordDefinition += `${sentence}

`;
        });

        let formattedWordExamples = '';
        newItalicWordsExamples.forEach((sentence, index) => {
          formattedWordExamples += `${index + 1}. ${sentence}

`;
        });

        message.channel
          .send(`- :regional_indicator_w: :regional_indicator_o: :regional_indicator_t: :regional_indicator_d:  -

**${WOTDTitle.charAt(0).toUpperCase()}${WOTDTitle.slice(1)}** [**${syllables}**]
(_${attribute}_)

**Definition**
${formattedWordDefinition}
**Example**
${formattedWordExamples}
**Did you know?**
${newItalicWordsDidYouKnow}
`);
      }
    );
	},
};