const fetch = require('node-fetch');

module.exports = {
  name: 'quote',
  description: 'Generate a random quote',
  async execute(message, args) {
    const json = await fetch('https://favqs.com/api/qotd')
      .then(response => response.json())
      .catch(console.error);

    message.channel.send(`"${json.quote.body}" - ${json.quote.author}`);
  },
};
