require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const http = require('http');
const express = require('express');
const config = require('./config');
const app = express();

app.get('/', (request, response) => {
  response.sendStatus(200);
});

app.listen(process.env.PORT);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const resetBot = message => {
  console.log('Restarting...');
  message.channel
    .send('Restarting...')
    .then(() => message.delete())
    .then(msg => client.destroy())
    .then(() => client.login(process.env.TOKEN))
    .then(() => {
      console.log(`Logged in as ${client.user.tag}!`);
      console.log('Ready!');
      message.delete();
      message.channel.send(`Restarted succesfully!`);
    })
    .catch(console.error);
};

client.login(process.env.TOKEN);

client.on('ready', function(evt) {
  console.log('Connected');
  console.log(`Logged in as: ${client.user.tag}`);
  client.user.setActivity('Maintenance Mode', {type: 'PLAYING'});
});

client.on('message', async message => {
  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  const commandName = args.shift().toLowerCase();

  if (commandName === 'reset' && message.author.id === config.authorId) {
    resetBot(message);
  }

  if (commandName === 'say' && message.author.id === config.authorId) {
    message.delete();
    return message.channel.send(message.content.slice(6));
  }

  if (!client.commands.has(commandName) || message.author.id === config.botId)
    return;

  const command = client.commands.get(commandName);

  if (command.dev && message.author.id !== config.authorId) {
    return message.reply('Only the developer can execute that command!');
  }

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${config.prefix}${
        command.name
      } ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error trying to execute that command!');
  }
});
