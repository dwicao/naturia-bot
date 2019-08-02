const fetch = require('node-fetch');

module.exports = {
  name: 'joke',
  description: 'Generate a random joke',
  async execute(message, args) {
    const json = await fetch(
      'https://official-joke-api.appspot.com/random_joke'
    )
      .then(response => response.json())
      .catch(console.error);

    message.channel.send(`"${json.setup}"
|| ${json.punchline} ||`);
  },
};
