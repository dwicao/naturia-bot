const request = require('request');

module.exports = {
  name: 'question',
  description: 'Ask anything: n.question who are you?',
  async execute(message, args) {
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
  },
};
