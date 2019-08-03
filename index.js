require("dotenv").config();
const path = require("path");
const fs = require("fs");
const Discord = require("discord.js");
const http = require("http");
const express = require("express");
const messageHandler = require("./messageHandler");
const app = express();

app.get("/", (request, response) => {
  response.sendStatus(200);
});

app.listen(process.env.PORT);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.commandPaths = new Discord.Collection();

const getPath = dir => {
  const result = [];

  const files = [dir];
  do {
    const filepath = files.pop();
    const stat = fs.lstatSync(filepath);
    if (stat.isDirectory()) {
      fs.readdirSync(filepath).forEach(f => files.push(path.join(filepath, f)));
    } else if (stat.isFile()) {
      result.push(path.relative(dir, filepath));
    }
  } while (files.length !== 0);

  return result;
};

const commandFiles = getPath("./commands");

for (const filePath of commandFiles) {
  const command = require(`./commands/${filePath}`);
  client.commands.set(command.name, command);
  client.commandPaths.set(command.name, filePath);
}

client.login(process.env.TOKEN);

client.on("ready", function(evt) {
  console.log("Connected");
  console.log(`Logged in as: ${client.user.tag}`);
  client.user.setActivity("n.help", { type: "LISTENING" });
});

client.on("message", message => {
  messageHandler(client, message);
});
