const { getRandomInt } = require("../../utils");
const { prefix } = require("../../config");
const figlet = require("figlet");
const text2png = require("text2png");
const randomWords = require("random-words");

let running = false;
let interval;

class TypingVariable {
  constructor() {
    this.words = "";
  }

  setWords(words) {
    this.words = words;
  }

  getWords() {
    return this.words;
  }
}

const runner = () =>
  new Promise((resolve, reject) => {
    figlet.fonts((err, fonts) => {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }

      const font = fonts[getRandomInt(0, fonts.length)];
      const words = randomWords({ exactly: 1, wordsPerString: 2 })[0];

      figlet(words, { font }, (err2, data) => {
        if (err2) {
          console.log("Something went wrong...");
          console.dir(err2);
          return;
        }

        const image = text2png(data, {
          color: "orange",
          font: "12px monospace"
        });

        resolve({ image, words });
      });
    });
  });

const winner = ({ message, typingVariable, answer }) => {
  typingVariable.setWords("");

  return message.reply(
    `Correct! The answer is \`${answer}\`. You got 10 points!`
  );
};

const typingVariable = new TypingVariable();

module.exports = {
  runner,
  winner,
  variable: typingVariable,
  name: "typing",
  description: "Generate words for typing contest",
  allowedChannelID: process.env.TYPING_CHANNEL_ID,
  cooldown: parseInt(process.env.TYPING_INTERVAL, 10),
  execute(message, args) {
    interval = undefined;

    if (!running && typeof interval === "undefined") {
      interval = setInterval(async () => {
        const { image, words } = await runner();
        const previousAnswer = typingVariable.getWords()
          ? `_Previous answer is \`${typingVariable.getWords()}\`_\nPlease type corresponding 2 words below:`
          : "";

        typingVariable.setWords(words);

        message.channel
          .send(previousAnswer, {
            files: [{ attachment: image }]
          })
          .catch(() => {
            message.channel.send(
              `Error! Please start the contest again by typing \`${prefix}.typing\` in chat`
            );
            interval = undefined;
            running = false;
          });
      }, process.env.TYPING_INTERVAL);
    }

    running = true;

    return message.reply(
      `Typing contest will be started in ${process.env.TYPING_INTERVAL /
        1000} seconds.`
    );
  }
};
