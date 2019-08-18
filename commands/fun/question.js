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
    const answer = await runner(args.join(" "), process.env.WOLFRAM_APPID);

    const result = answer
      .replace("Wolfram|Alpha", "I")
      .replace("Wolfram Alpha", "Naturia");

    message.channel.send(result);
  }
};
