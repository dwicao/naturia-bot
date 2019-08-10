const fs = require("fs");
const puppeteer = require("puppeteer");
const { prefix } = require("../../config");
const { getRootDir, getRandomInt } = require("../../utils");

const rootDir = __dirname.substring(0, __dirname.indexOf("/command"));

module.exports = {
  name: "test-proxy",
  devOnly: true,
  aliases: ["tp"],
  execute(message, args) {
    let randomProxy = "";

    fs.readFile(`${getRootDir()}/private/proxy.txt`, "utf8", (err, data) => {
      if (err) console.error(err);

      const splitted = data.toString().split("\n");

      randomProxy = splitted[getRandomInt(0, splitted.length)];
    });

    return message.channel.send("loading").then(async msg => {
      const browser = await puppeteer.launch({
        args: ["--no-sandbox", `--proxy-server=${randomProxy}`]
      });

      const page = await browser.newPage();

      await page.goto("http://amibehindaproxy.com/", {
        waitUntil: "domcontentloaded"
      });

      await page.screenshot({
        path: `${rootDir}/private/puppeteer.jpg`,
        type: "jpeg"
      });

      await page.close();

      await browser.close();

      return message.channel.send("", {
        files: [`${rootDir}/private/puppeteer.jpg`]
      });
    });
  }
};
