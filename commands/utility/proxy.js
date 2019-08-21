const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");
const { RichEmbed } = require("discord.js");
const {
  toMatrix,
  getRootDir,
  getHeaders,
  sendErrorMessage
} = require("../../utils");

const runner = () =>
  new Promise((resolve, reject) => {
    const reqOptions = {
      url: "https://www.sslproxies.org",
      headers: getHeaders()
    };

    request(reqOptions, (error, response, data) => {
      if (error) {
        reject(error);
      }

      const $ = cheerio.load(data);

      const tempData = [];

      $("#proxylisttable td").each((i, elem) => {
        tempData.push($(elem).text());
      });

      const matrixedData = toMatrix(tempData, 8);

      const LIMIT = 20;
      let content = "";
      let count = 0;

      matrixedData.forEach(element => {
        count++;
        element.forEach((elem, index) => {
          if (count < LIMIT) {
            const IS_IP_AND_PORT = index === 0 || index === 1;
            const IS_COUNTRY = index === 3;

            if (IS_IP_AND_PORT) {
              content += `${elem} `;
            }

            if (IS_COUNTRY) {
              content += `${elem}\n`;
            }
          }
        });
      });

      const ip = [];
      const port = [];

      tempData.forEach((item, index) => {
        if (index % 8 === 0) {
          ip.push(item);
          port.push(tempData[index + 1]);
        }
      });

      const ipAndPort = [];

      ip.forEach((item, index) => {
        ipAndPort.push(`${item}:${port[index]}`);
      });

      const file = fs.createWriteStream(`${getRootDir()}/public/proxy.txt`);
      file.on("error", console.error);
      ipAndPort.forEach(value => file.write(`${value}\n`));
      file.end();

      resolve({ ipAndPort, content });
    });
  });

module.exports = {
  runner,
  name: "proxy",
  description: "Get a list of random 20 SSL Proxies",
  execute(message, args) {
    runner()
      .then(({ content }) => {
        const embed = new RichEmbed()
          .setColor(`RANDOM`)
          .setTitle("Random 20 SSL Proxies")
          .addField("<IP> <PORT> <COUNTRY>", content, true);

        return message.channel.send(embed);
      })
      .catch(err => {
        return sendErrorMessage(message, err);
      });
  }
};
