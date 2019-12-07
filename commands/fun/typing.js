const { getRandomInt } = require("../../utils");
const figlet = require("figlet");
const text2png = require("text2png");
const randomWords = require("random-words");

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

module.exports = {
  runner,
  winner,
  variable: new TypingVariable(),
  name: "typing",
  description: "Generate words for typing contest",
  devOnly: true,
  async execute(message, args) {
    const { image, words } = await runner();

    return message.channel.send({
      files: [{ attachment: image }]
    });
  }
};
