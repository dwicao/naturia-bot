const puppeteer = require("puppeteer");
const { getRootDir } = require("../../utils");

module.exports = {
  name: "viewlink",
  aliases: ["vl"],
  description: "Get page view from a link",
  cooldown: 15,
  args: true,
  usage: "https://google.com",
  execute(message, args) {
    message.channel
      .send("Fetching data...")
      .then(async msg => {
        const browser = await puppeteer.launch({
          args: ["--no-sandbox"]
        });

        const page = await browser.newPage();

        await page.goto(args[0]);

        await page.screenshot({
          path: `${getRootDir()}/public/puppeteer.jpg`,
          type: "jpeg"
        });

        await browser.close();

        message.channel.send({
          files: [{ attachment: `${getRootDir()}/public/puppeteer.jpg` }]
        });

        msg.delete();
      })
      .catch(error => {
        message.channel.send("Fetching Error! Please Try Again.");
      });
  }
};
