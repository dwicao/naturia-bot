const { RichEmbed } = require("discord.js");
const { prefix } = require("../../config");

const TITLE = "List of my commands.";

module.exports = {
  name: "help",
  description: TITLE,
  aliases: ["commands"],
  usage: "[command name]",
  cooldown: 5,
  execute(message, args) {
    const { commands, commandPaths } = message.client;

    if (!args.length) {
      const DESCRIPTION = `You can send \`${prefix}help [command name]\` to get info on a specific command!
This bot is open-source, you can contribute at [here](https://github.com/dwicao/naturia 'https://github.com/dwicao/naturia')`;

      const embed = {
        color: 0x7289da,
        title: TITLE,
        description: DESCRIPTION,
        fields: [],
        footer: {
          text: "Made with ♥ by rein#0707"
        }
      };

      const categoryCollection = {};

      commandPaths.forEach(command => {
        const categoryName = command.split("/")[0];
        const commandName = (command.split("/")[1] || "").replace(".js", "");

        categoryCollection[categoryName] = `${(categoryCollection[
          categoryName
        ] || "") + commandName}, `;
      });

      Object.keys(categoryCollection).forEach(name => {
        const clutteredDalue = categoryCollection[name];
        const value = (clutteredDalue || "").substring(
          0,
          clutteredDalue.length - 2
        );

        embed.fields.push({
          name,
          value
        });
      });

      return message.channel.send({ embed });
    }

    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply("That's not a valid command!");
    }

    const data = [];

    data.push(`**Name:** ${command.name}`);

    if (command.devOnly)
      data.push(`**Note:** Only the administrators can execute this command`);
    if (command.aliases)
      data.push(`**Aliases:** ${command.aliases.join(", ")}`);
    if (command.description)
      data.push(`**Description:** ${command.description}`);
    if (command.usage)
      data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

    data.push(`**Cooldown:** ${command.cooldown || 1} second(s)`);

    const embed = new RichEmbed()
      .setColor(`RANDOM`)
      .setDescription(data.join("\n"));

    message.channel.send(embed);
  }
};
