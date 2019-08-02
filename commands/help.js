const {RichEmbed} = require('discord.js');

module.exports = {
  name: 'help',
  description: 'List of all commands',
  execute(message, args) {
    const listCommands =
      'ping | pfp | anime | waifu | question | joke | quote | advice | gender | bored | name';

    const embed = new RichEmbed()
      .setColor(`RANDOM`)
      .addField('List of commands:', listCommands, true)
      .setFooter('Created with ♥ by rein#8888');

    message.channel.send(embed);
  },
};
