require("dotenv").config();
const fs = require('fs');
const Discord = require('discord.js');
const http = require('http');
const express = require('express');
const app = express();

// Initialize Discord Bot
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const PREFIX = 'n.';
let isEnd = false;
let _timer;
const timeToWait = 3000; // 20 seconds

app.get('/', (request, response) => {
  response.sendStatus(200);
});

app.listen(process.env.PORT);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

// Turn bot off (destroy), then turn it back on
const resetBot = message => {
  console.log('Restarting...');
  isEnd = !isEnd;
  clearTimeout(_timer);
  message.channel
    .send('phew')
    .then(() => message.delete(timeToWait))
    .then(msg => client.destroy())
    .then(() => client.login(process.env.TOKEN))
    .then(() => {
      console.log(`Logged in as ${client.user.tag}!`);
      console.log('Ready!');
      message.channel.send(`done`);
    })
    .catch(console.error);
};

// Stop the timer
const stopBot = message => {
  isEnd = !isEnd;
  clearTimeout(_timer);
  message.delete(timeToWait).catch(console.error);
};

client.login(process.env.TOKEN);

client.on('ready', function(evt) {
  console.log('Connected');
  console.log(`Logged in as: ${client.user.tag}`);
});

client.on('message', async message => {
  const args = message.content
    .slice(PREFIX.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'reset' && message.author.id === '442830299781529610') {
    resetBot(message);
  }

  if (command === 'say' && message.author.id === '442830299781529610') {
    message.delete();
    message.channel.send(message.content.slice(6));
  }

  if (command == 'stop' && message.author.id === '442830299781529610') {
    stopBot(message);
  }

  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});
