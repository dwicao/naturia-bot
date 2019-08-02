const fetch = require('node-fetch');

module.exports = {
	name: 'gender',
	description: 'Check gender from name: n.gender john',
	async execute(message, args) {
		const firstName = message.content.split(' ')[1];
    const fullName = message.content.slice(9);

    const json = await fetch(`https://api.genderize.io/?name=${firstName}`)
      .then(response => response.json())
      .catch(console.error);

    const unknownMessage = `Hmmm... I can't guess if ${fullName} is a male/female`;

    const genderMessage = `${fullName} is a ${
      json.gender
    }, probability: ${json.probability * 100}%`;

    if (message.content.split(' ').length <= 1) {
      message.channel.send(
        'You must specify the first name, example: ##gender andy'
      );
    } else {
      message.channel.send(json.gender ? genderMessage : unknownMessage);
    }
	},
};