const request = require("request");
const cheerio = require("cheerio");
const { getHeaders, sendErrorMessage } = require("../../utils");

const runner = () =>
  new Promise((resolve, reject) => {
    const options = {
      url: "https://picrew.me",
      headers: getHeaders()
    };

    request(options, (error, response, data) => {
      const $ = cheerio.load(data);

      const imageSource = $(
        ".sitetop_discovery .sitetop_discovery_list_img img"
      ).attr("src");

      if (error) {
        reject(error);
      } else {
        resolve(imageSource);
      }
    });
  });

module.exports = {
  runner,
  name: "pfp",
  description: "Generate a random profile picture (avatar)",
  aliases: ["avatar"],
  async execute(message, args) {
    const imageSource = await runner();

    if (imageSource) {
      return message.channel.send("Here is your random profile picture.", {
        files: [imageSource]
      });
    }

    sendErrorMessage(message);
  }
};
