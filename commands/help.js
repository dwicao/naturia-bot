module.exports = {
	name: 'help',
	description: 'List of all commands',
	execute(message, args) {
		message.channel.send(`rein#8888 is my Lord
These are my commands:
ping | pfp | anime | waifu | question | joke | quote | advice | gender | bored | name
`);
	},
};