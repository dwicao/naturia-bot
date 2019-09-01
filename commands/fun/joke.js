const fetch = require("node-fetch");

const runner = () =>
  fetch("https://official-joke-api.appspot.com/random_joke").then(response =>
    response.json()
  );

module.exports = {
  runner,
  name: "joke",
  description: "Generate a random joke",
  async execute(message, args) {
    const { setup, punchline } = await runner();

    return message.channel.send(`"${setup}"
|| ${punchline} ||`);
  }
};
