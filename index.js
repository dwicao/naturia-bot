require("dotenv").config();
const Discord = require("discord.js");
const http = require("http");
const express = require("express");
const messageHandler = require("./messageHandler");
const { getPath, setActivity } = require("./utils");
const app = express();

app.get("/", (request, response) => {
  response.sendStatus(200);
});

app.listen(process.env.PORT);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const commandFiles = getPath("./commands");
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.commandPaths = new Discord.Collection();

for (const filePath of commandFiles) {
  const command = require(`./commands/${filePath}`);
  client.commands.set(command.name, command);
  client.commandPaths.set(command.name, filePath);
}

client.login(process.env.TOKEN);

client.on("ready", () => {
  console.log(`Logged in as: ${client.user.tag}`);
  setActivity(client);
});

client.on("message", message => {
  messageHandler(client, message);
});
