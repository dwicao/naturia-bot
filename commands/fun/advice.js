const fetch = require("node-fetch");

const runner = () =>
  fetch("https://api.adviceslip.com/advice").then(response => response.json());

module.exports = {
  runner,
  name: "advice",
  description: "Generate a random advice",
  async execute(message, args) {
    const result = await runner();

    message.channel.send(`Advice: "${result.slip.advice}"`);
  }
};
