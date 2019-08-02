const fetch = require('node-fetch');

module.exports = {
	name: 'bored',
	description: 'A command when you are bored',
	async execute(message, args) {
		const json = await fetch(`https://www.boredapi.com/api/activity`)
      .then(response => response.json())
      .catch(console.error);

    if (json && json.activity) {
      message.channel.send(json.activity);
    } else {
      message.channel.send('Error! try again.');
    }
	},
};