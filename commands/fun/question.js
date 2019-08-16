const request = require("request");
const { getHeaders } = require("../../utils");

const runner = (question, wolfram_appid) =>
  new Promise((resolve, reject) => {
    const url = `https://api.wolframalpha.com/v1/result?i=${encodeURIComponent(
      question
    )}&appid=${wolfram_appid}`;

    const options = {
      url,
      headers: getHeaders()
    };

    request(options, (error, response, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(Buffer.from(data).toString());
      }
    });
  });

module.exports = {
  runner,
  name: "question",
  description: "Ask about anything",
  args: true,
  aliases: ["ask"],
  usage: "what is human?",
  async execute(message, args) {
    const question = message.content.slice(11);

    const url = `https://api.wolframalpha.com/v1/result?i=${encodeURIComponent(
      question
    )}&appid=${process.env.WOLFRAM_APPID}`;

    const options = {
      url,
      headers: getHeaders()
    };

    request(options, (error, response, data) => {
      if (error) {
        message.channel.send(
          `I understand the question but didn't know the answer.`
        );
      } else {
        const answer = Buffer.from(data).toString();
        const result = answer
          .replace("Wolfram|Alpha", "I")
          .replace("Wolfram Alpha", "Naturia");

        message.channel.send(result);
      }
    });
  }
};
