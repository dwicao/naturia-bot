const request = require("request");
const cheerio = require("cheerio");
const { getHeaders, sendErrorMessage } = require("../../utils");

const runner = () =>
  new Promise((resolve, reject) => {
    const options = {
      url: "https://tpaste.net/search?keyword=accounts",
      headers: getHeaders()
    };

    request(options, (error, response, data) => {
      const $ = cheerio.load(data);
      const titles = [];
      const links = [];
      const longagos = [];

      const listElements = $(".list-group-flush a");

      const longagoElements = $(".text-muted");

      listElements.each((index, element) => {
        const title =
          $(element)
            .text()
            .trim() || "";
        const link = $(element).attr("href") || "";
        if (title.toLowerCase() !== "plaintext") {
          titles.push(title);
          links.push(link.replace("tpaste.net/", "tpaste.net/raw/"));
        }
      });

      longagoElements.each((index, element) => {
        const longagoText =
          $(element)
            .text()
            .trim() || "";

        longagos.push(longagoText);
      });

      if (error) {
        reject(error);
      } else {
        resolve({
          titles: titles.slice(0, titles.length - 7),
          links: links.slice(0, links.length - 7),
          longagos: longagos.slice(0, longagos.length - 7)
        });
      }
    });
  });

module.exports = {
  runner,
  name: "premium-users",
  description: "Get a list of premium users",
  aliases: ["pu"],
  devOnly: true,
  async execute(message, args) {
    const result = await runner();

    if (result.longagos && result.longagos.length) {
      result.longagos.forEach((longago, i) => {
        if ((longago || "").includes("hours ago")) {
          const filename = `[${(result.links[i] || "").substring(
            result.links[i].indexOf("raw/") + "raw/".length
          )}.txt]`;

          return message.channel.send(`${result.titles[i]} ${filename}`, {
            files: [{ attachment: result.links[i] }]
          });
        }
      });
    }
  }
};
