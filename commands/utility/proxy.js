const request = require("request");
const cheerio = require("cheerio");
const { RichEmbed } = require("discord.js");
const { toMatrix, limitString } = require("../../utils");

module.exports = {
  name: "proxy",
  description: "Get a list of random 20 SSL Proxies",
  execute(message, args) {
    request("https://www.sslproxies.org", (error, response, data) => {
      const $ = cheerio.load(data);

      const tempData = [];

      $("#proxylisttable td").each((i, elem) => {
        tempData.push($(elem).text());
      });

      const matrixedData = toMatrix(tempData, 8);

      const LIMIT = 20;
      let result = "";
      let count = 0;

      matrixedData.forEach(element => {
        count++;
        element.forEach((elem, index) => {
          if (count <= LIMIT) {
            const IS_IP_AND_PORT = index === 0 || index === 1;
            const IS_COUNTRY = index === 3;

            if (IS_IP_AND_PORT) {
              result += `${elem} `;
            }

            if (IS_COUNTRY) {
              result += `${elem}\n`;
            }
          }
        });
      });

      const embed = new RichEmbed()
        .setColor(`RANDOM`)
        .setTitle("Random 20 SSL Proxies")
        .addField("<IP> <PORT> <COUNTRY>", result, true)
        .setFooter(`Updated ${matrixedData[0][matrixedData[0].length - 1]}`);

      message.channel.send(embed);
    });
  }
};
