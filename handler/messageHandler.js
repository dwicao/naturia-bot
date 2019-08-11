const Discord = require("discord.js");
const { prefix, botId, authorId } = require("../config");

const cooldowns = new Discord.Collection();

module.exports = (client, message) => {
  const correctPrefix =
    message.content.slice(0, prefix.length).toLowerCase() ===
    prefix.toLowerCase();

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);

  const commandName = args.shift().toLowerCase();

  const resetBot = () => {
    console.log("Restarting...");
    message.channel
      .send("Restarting...")
      .then(() => message.delete())
      .then(msg => client.destroy())
      .then(() => client.login(process.env.TOKEN))
      .then(() => {
        console.log(`Logged in as ${client.user.tag}!`);
        console.log("Ready!");
        message.channel.send(`Restarted succesfully!`);
      })
      .catch(console.error);
  };

  if (commandName === "restart" && message.author.id === authorId) {
    return resetBot(message);
  }

  if (commandName === "say" && message.author.id === authorId) {
    message.delete();
    return message.channel.send(message.content.slice(6));
  }

  if (message.content.includes(`<@${botId}>`)) {
    return message.channel.send(`My prefix is \`${prefix}\``);
  }

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      cmd => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!correctPrefix || !command || message.author.id === botId) return;

  if (command.devOnly && message.author.id !== authorId) {
    return message.reply("Only the administrator can execute that command!");
  }

  if (command.guildOnly && message.channel.type !== "text") {
    return message.reply("I can't execute that command inside DMs!");
  }

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const userCooldown = timestamps.get(message.author.id);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    const defaultOptions = {
      shouldSendMessage: true
    };

    command.execute(message, args, defaultOptions);
  } catch (error) {
    console.error(error);
    message.reply("There was an error trying to execute that command!");
  }
};
