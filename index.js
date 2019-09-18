require("dotenv").config();
const Discord = require("discord.js");
const http = require("http");
const express = require("express");
const messageHandler = require("./handler/messageHandler");
const { getPath, setActivity } = require("./utils");
const routes = require("./routes");
const app = express();

const IS_PROD = process.env.ENV === "production";
const TOKEN = IS_PROD ? process.env.TOKEN : process.env.DEV_TOKEN;

const commandFiles = getPath("./commands");
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.commandPaths = new Discord.Collection();

for (const filePath of commandFiles) {
  const command = require(`./commands/${filePath}`);
  client.commands.set(command.name, command);
  client.commandPaths.set(command.name, filePath);
}

app.set("view engine", "ejs");

app.get("/", routes.root);
app.get("/wotd", (req, res) => routes.wotd(req, res, client));
app.get("/hn", (req, res) => routes.hn(req, res, client));
app.get("/doraemon", routes.doraemon);
app.get("/joke", routes.joke);
app.get("/javascript_trending", (req, res) =>
  routes.javascript_trending(req, res, client)
);
app.get("/steam_deals", (req, res) => routes.steam_deals(req, res, client));
app.get("/random_anime", (req, res) => routes.random_anime(req, res, client));
app.get("/random_anime", (req, res) => routes.random_anime(req, res, client));
app.get("/disboard_status", (req, res) =>
  routes.disboard_status(req, res, client)
);
app.get("/netflix_recommender", (req, res) =>
  routes.netflix_recommender(req, res, client)
);

app.listen(process.env.PORT);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

client.login(TOKEN);

client.on("ready", () => {
  console.log(`Logged in as: ${client.user.tag}`);
  setActivity(client);
});

client.on("message", message => {
  messageHandler(client, message);
});
