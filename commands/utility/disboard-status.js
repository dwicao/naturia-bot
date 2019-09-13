const request = require("request");
const cheerio = require("cheerio");
const { RichEmbed } = require("discord.js");
const { getHeaders, sendErrorMessage } = require("../../utils");

const runner = () =>
  new Promise((resolve, reject) => {
    const url = "https://disboard.org/server/596360538288816138";

    const options = {
      url,
      headers: getHeaders()
    };

    request(options, (error, response, data) => {
      const titles = [];

      const $ = cheerio.load(data);

      const text =
        $(".server-bumped-at")
          .text()
          .trim() || "";

      const duration = parseInt(text.match(/\d+/)[0], 10);

      const isMinutes = text.toLowerCase().includes("minutes");

      const ready = duration > 120 && isMinutes;

      if (error) {
        reject(error);
      } else {
        resolve({ ready, text });
      }
    });
  });

module.exports = {
  runner,
  name: "disboard-status",
  description: "Get the status from Disboard if this server can be bumped",
  aliases: ["ds"],
  async execute(message, args) {
    const { text, ready } = await runner();
    const readyMsg = `Server bump is available, please type \`!d bump\` in chat`;
    const status = `This server was ${text.toLowerCase()}`;
    const result = ready ? readyMsg : status;

    if (text) {
      return message.channel.send(result);
    }

    return sendErrorMessage(message);
  }
};
