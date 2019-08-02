const fetch = require('node-fetch');

module.exports = {
	name: 'name',
	description: 'Generate a random command',
	async execute(message, args) {
		const json = await fetch(`https://uinames.com/api`)
      .then(response => response.json())
      .catch(console.error);

    if (json && json.name && json.surname && json.gender && json.region) {
      message.channel.send(
        `${json.name} ${json.surname} (${json.gender}) - ${json.region}`
      );
    } else {
      message.channel.send('Error! try again.');
    }
	},
};