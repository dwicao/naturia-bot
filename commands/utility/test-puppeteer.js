const puppeteer = require("puppeteer");
const { getRandomProxy, getRootDir } = require("../../utils");

module.exports = {
  name: "testPuppeteer",
  devOnly: true,
  aliases: ["tp"],
  execute(message, args) {
    return message.channel.send("Loading...").then(msg => {
      getRandomProxy()
        .then(async proxy => {
          const browser = await puppeteer.launch({
            args: ["--no-sandbox", `--proxy-server=${proxy}`]
          });

          const page = await browser.newPage();

          await page.goto("http://amibehindaproxy.com/", {
            waitUntil: "domcontentloaded"
          });

          await page.screenshot({
            path: `${getRootDir()}/public/puppeteer.jpg`,
            type: "jpeg"
          });

          await page.close();

          await browser.close();

          msg.delete();

          return message.channel.send("", {
            files: [`${getRootDir()}/public/puppeteer.jpg`]
          });
        })
        .catch(err => {
          console.error(err);
          msg.edit("Error fetching! Try Again.");
        });
    });
  }
};
