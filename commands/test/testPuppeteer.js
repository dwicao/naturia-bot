const puppeteer = require("puppeteer");
const proxyCmd = require("../utility/proxy");
const { getRandomProxy, getRootDir, sendEditErrorMessage } = require("../../utils");

module.exports = {
  name: "testPuppeteer",
  devOnly: true,
  aliases: ["tp"],
  execute(message, args) {
    proxyCmd.runner().then().catch(console.error);

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
          sendEditErrorMessage(msg, err)
        });
    });
  }
};
