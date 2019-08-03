const {RichEmbed} = require('discord.js');
const {prefix} = require('../config');

module.exports = {
  name: 'help',
  description: 'List all of my commands.',
  aliases: ['commands'],
  usage: '[command name]',
  cooldown: 5,
  execute(message, args) {
    const data = [];
    const {commands} = message.client;

    if (!args.length) {
      data.push("Here's a list of all my commands:");
      data.push(commands.map(command => command.name).join(', '));
      data.push(
        `You can send \`${prefix}help [command name]\` to get info on a specific command!

This bot is open source, you can contribute at [here](https://github.com/dwicao/naturia 'https://github.com/dwicao/naturia')`
      );

      const embed = new RichEmbed()
        .setColor(`RANDOM`)
        .setTitle("Hello! I'm Naturia!")
        .addField(data[0], data[1], true)
        .setDescription(data[2])
        .setFooter('Created with ♥ by rein#8888');

      return message.channel.send(embed);
    }

    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply("That's not a valid command!");
    }

    data.push(`**Name:** ${command.name}`);

    if (command.devOnly)
      data.push(`**Note:** Only the administrators can execute this command`);
    if (command.aliases)
      data.push(`**Aliases:** ${command.aliases.join(', ')}`);
    if (command.description)
      data.push(`**Description:** ${command.description}`);
    if (command.usage)
      data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

    data.push(`**Cooldown:** ${command.cooldown || 1} second(s)`);

    const embed = new RichEmbed()
      .setColor(`RANDOM`)
      .setDescription(data.join('\n'));

    message.channel.send(embed);
  },
};
