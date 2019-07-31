const Discord = require('discord.js');
const RichEmbed = require('discord.js').RichEmbed;
const http = require('http');
const imghash = require('imghash');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const request = require('request').defaults({encoding: null});
const pokemons = require('./pokemons.json');
const express = require('express');
const app = express();

// Initialize Discord Bot
const client = new Discord.Client();
const PREFIX = 'n.';
let isEnd = false;
let _timer;
const timeToWait = 3000; // 20 seconds

let WOTDTitle = '';
let attribute = '';
let syllables = '';
let prounciation = [];
let definitionAndFacts = [];
let exampleWords = [];
let italicWordsDidYouKnow = [];
let italicWordsExamples = [];

app.get('/', (request, response) => {
  response.sendStatus(200);
});

app.listen(process.env.PORT);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

// Turn bot off (destroy), then turn it back on
const resetBot = message => {
  console.log('Restarting...');
  isEnd = !isEnd;
  clearTimeout(_timer);
  message.channel
    .send('phew')
    .then(() => message.delete(timeToWait))
    .then(msg => client.destroy())
    .then(() => client.login(process.env.TOKEN))
    .then(() => {
      console.log(`Logged in as ${client.user.tag}!`);
      console.log('Ready!');
      message.channel.send(`done`);
    })
    .catch(console.error);
};

// Stop the timer
const stopBot = message => {
  isEnd = !isEnd;
  clearTimeout(_timer);
  message.delete(timeToWait).catch(console.error);
};

client.login(process.env.TOKEN);

client.on('ready', function(evt) {
  console.log('Connected');
  console.log(`Logged in as: ${client.user.tag}`);
});

client.on('message', async message => {
  const prefix = PREFIX;
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  const isWOTD =
    (message.author.discriminator === '0000' && message.content === 'WOTD') ||
    (command === 'wotd' && message.author.id === '442830299781529610');

  // start wotd
  if (isWOTD) {
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
  }

  const isPokecord = message.author.id === '365975655608745985';
  // change `false` below to `isPokecord` to auto-catch the pokemon
  if (false) {
    if (
      !isEnd &&
      message &&
      message.embeds[0] &&
      message.embeds[0].image &&
      message.embeds[0].image.url &&
      message.embeds[0].title &&
      message.embeds[0].title === '‌‌A wild pokémon has appeared!'
    ) {
      isEnd = false;

      message.channel.startTyping();

      request(message.embeds[0].image.url, (error, response, data) => {
        if (error) return;

        imghash.hash(data).then(hash => {
          const result = pokemons[hash];

          _timer = setTimeout(() => {
            message.channel.send(`p!catch ${result.toLowerCase()}`).then(() => {
              message.channel.stopTyping();
            });
          }, Math.floor(Math.random() * 1000) + 2000);
        });
      });
    }
  }

  // Just to make sure we execute codes below if it has the prefix
  if (message.content.indexOf(PREFIX) !== 0) return;

  if (command === 'anime') {
    const MIN = 0;
    const MAX = 1270;
    const randNum = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;

    const URI = `https://www.randomanime.org/shows/${randNum}/`;

    request(URI, (error, response, data) => {
      const $ = cheerio.load(data);

      const descriptionResult = $('[itemprop=about]')
        .text()
        .trim();
      const cleanDescription = descriptionResult.replace('...Read More', '');
      const description = cleanDescription.replace('Read Less', '');

      const detailsCollection = [];
      const detailsResult = $('.quick-info-container .quick-info li').each(
        (i, element) => {
          detailsCollection.push($(element).text());
        }
      );
      const details = detailsCollection.slice(0, detailsCollection.length - 1);

      const thumbnailSrc = `https://www.randomanime.org/images/shows/${randNum}/anime-l.jpg`;

      const TITLE = 'Random Anime Info';

      const renderMainSection = () => {
        let result = '';
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

      const renderDescription = () => {
        const maxLength = 1024;
        return description.length > maxLength
          ? description.substring(0, maxLength - 3) + '...'
          : description;
      };

      const embeddedDefinition = new RichEmbed()
        .setColor(`RANDOM`)
        .attachFiles([thumbnailSrc])
        .addField(TITLE, renderMainSection(), true)
        .addField('Description', renderDescription(), true);

      return message.channel.send(embeddedDefinition);
    });
  }

  if (command === 'pfp') {
    request('https://picrew.me', (error, response, data) => {
      const $ = cheerio.load(data);

      const imageSource = $(
        '.sitetop_discovery .sitetop_discovery_list_img img'
      ).attr('src');

      if (imageSource) {
        return message.channel.send('Here is your random profile picture.', {
          files: [imageSource],
        });
      }

      return message.channel.send('Fetching Error! Please Try Again.');
    });
  }

  if (command === 'waifu') {
    const MIN = 0;
    const MAX = 199999;
    const randNum = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;

    const imageSource = `https://www.thiswaifudoesnotexist.net/example-${randNum}.jpg`;

    if (imageSource) {
      return message.channel.send(
        'Here is your random waifu (generated by AI)',
        {
          files: [imageSource],
        }
      );
    }

    return message.channel.send('Fetching Error! Please Try Again.');
  }

  if (command === 'bored') {
    const json = await fetch(`https://www.boredapi.com/api/activity`)
      .then(response => response.json())
      .catch(console.error);

    if (json && json.activity) {
      message.channel.send(json.activity);
    } else {
      message.channel.send('Error! try again.');
    }
  }

  if (command === 'name') {
    const json = await fetch(`https://uinames.com/api`)
      .then(response => response.json())
      .catch(console.error);

    if (json && json.name && json.surname && json.gender && json.region) {
      message.channel.send(
        `${json.name} ${json.surname} (${json.gender}) - ${json.region}`
      );
    } else {
      message.channel.send('Error! try again.');
    }
  }

  if (command === 'gender') {
    const firstName = message.content.split(' ')[1];
    const fullName = message.content.slice(9);

    const json = await fetch(`https://api.genderize.io/?name=${firstName}`)
      .then(response => response.json())
      .catch(console.error);

    const unknownMessage = `Hmmm... I can't guess if ${fullName} is a male/female`;

    const genderMessage = `${fullName} is a ${
      json.gender
    }, probability: ${json.probability * 100}%`;

    if (message.content.split(' ').length <= 1) {
      message.channel.send(
        'You must specify the first name, example: ##gender andy'
      );
    } else {
      message.channel.send(json.gender ? genderMessage : unknownMessage);
    }
  }

  if (command === 'question') {
    const question = message.content.slice(11);
    const uri = `https://api.wolframalpha.com/v1/result?i=${encodeURIComponent(
      question
    )}&appid=${process.env.WOLFRAM_APPID}`;

    request(uri, (error, response, data) => {
      if (error) {
        message.channel.send(
          `I understand the question but didn't know the answer.`
        );
      } else {
        const answer = Buffer.from(data).toString();
        const result = answer
          .replace('Wolfram|Alpha', 'I')
          .replace('Wolfram Alpha', 'Naturia');

        message.channel.send(result);
      }
    });
  }

  if (command === 'quote') {
    const json = await fetch('https://favqs.com/api/qotd')
      .then(response => response.json())
      .catch(console.error);

    message.channel.send(`"${json.quote.body}" - ${json.quote.author}`);
  }

  if (command === 'advice') {
    const json = await fetch('https://api.adviceslip.com/advice')
      .then(response => response.json())
      .catch(console.error);

    message.channel.send(`Advice: "${json.slip.advice}"`);
  }

  if (command === 'joke') {
    const json = await fetch(
      'https://official-joke-api.appspot.com/random_joke'
    )
      .then(response => response.json())
      .catch(console.error);

    message.channel.send(`"${json.setup}"
|| ${json.punchline} ||`);
  }

  if (command === 'random' && message.author.id === '442830299781529610') {
    message.delete().catch(console.error);

    isEnd = false;

    function sendSpamMessage() {
      message.channel
        .send(
          `|| ${Math.floor(
            Math.random() * (9999999999999999 - 10 + 1) + 10
          )} ||`
        )
        .then(_msg => {
          _msg.delete().catch(console.error);
        })
        .catch(console.error);

      if (!isEnd) {
        _timer = setTimeout(sendSpamMessage, timeToWait);
      }
    }

    sendSpamMessage();
  }

  if (command === 'ping') {
    message.channel.send(`Pong! ${Math.round(client.ping)} ms`);
  }

  if (command === 'reset' && message.author.id === '442830299781529610') {
    resetBot(message);
  }

  if (command === 'help') {
    message.channel.send(`rein#8888 is my Lord
These are my commands:
ping | pfp | anime | waifu | question | joke | quote | advice | gender | bored | name
`);
  }

  if (command === 'say' && message.author.id === '442830299781529610') {
    message.delete();
    message.channel.send(message.content.slice(6));
  }

  if (command == 'stop' && message.author.id === '442830299781529610') {
    stopBot(message);
  }
});
