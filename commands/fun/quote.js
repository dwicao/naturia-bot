const fetch = require("node-fetch");

const runner = () =>
  fetch("https://favqs.com/api/qotd").then(response => response.json());

module.exports = {
  runner,
  name: "quote",
  description: "Generate a random quote",
  async execute(message, args) {
    const result = await runner();

    return message.channel.send(
      `"${result.quote.body}" - ${result.quote.author}`
    );
  }
};
