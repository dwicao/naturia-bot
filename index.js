require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const http = require('http');
const express = require('express');
const messageHandler = require('./messageHandler');
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

client.login(process.env.TOKEN);

client.on('ready', function(evt) {
  console.log('Connected');
  console.log(`Logged in as: ${client.user.tag}`);
  client.user.setActivity('n.help', {type: 'LISTENING'});
});

client.on('message', message => {
  messageHandler(client, message);
});
