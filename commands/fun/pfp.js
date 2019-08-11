const request = require("request");
const cheerio = require("cheerio");
const { getHeaders } = require("../../utils");

module.exports = {
  name: "pfp",
  description: "Generate a random profile picture (avatar)",
  aliases: ["avatar"],
  execute(message, args) {
    const options = {
      url: "https://picrew.me",
      headers: getHeaders()
    };

    request(options, (error, response, data) => {
      const $ = cheerio.load(data);

      const imageSource = $(
        ".sitetop_discovery .sitetop_discovery_list_img img"
      ).attr("src");

      if (imageSource) {
        return message.channel.send("Here is your random profile picture.", {
          files: [imageSource]
        });
      }

      message.channel.send("Fetching Error! Please Try Again.");
    });
  }
};
