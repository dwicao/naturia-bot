const fetch = require('node-fetch');

module.exports = {
	name: 'advice',
	description: 'Generate a random advice',
	async execute(message, args) {
    const json = await fetch('https://api.adviceslip.com/advice')
      .then(response => response.json())
      .catch(console.error);

    message.channel.send(`Advice: "${json.slip.advice}"`);
	},
};