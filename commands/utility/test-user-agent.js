const request = require("request");
const cheerio = require("cheerio");
const { getHeaders } = require("../../utils");

module.exports = {
  name: "testUserAgent",
  devOnly: true,
  aliases: ["tu"],
  execute(message, args, options) {
    const reqOptions = {
      url: "https://www.whatsmyua.info",
      headers: getHeaders()
    };

    request(reqOptions, (error, response, data) => {
      const $ = cheerio.load(data);

      const UAString = $(".input")
        .text()
        .trim();

      message.channel.send(UAString);
    });
  }
};
