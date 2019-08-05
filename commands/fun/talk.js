const puppeteer = require("puppeteer");

const getRootDir = () => __dirname.substring(0, __dirname.indexOf("/command"));

module.exports = {
  name: "talk",
  description: "Talk with me (Naturia)",
  args: true,
  usage: "how are you?",
  cooldown: 5,
  execute(message, args) {
    return message.channel.send(":thinking: (thinking...)").then(async msg => {
      const browser = await puppeteer.launch({
        args: ["--no-sandbox"]
      });

      const page = await browser.newPage();

      await page.goto("https://www.cleverbot.com/", {
        waitUntil: "domcontentloaded"
      });
      await page.waitFor("input[name=stimulus]");
      await page.focus("input[name=stimulus]");
      await page.keyboard.type(args.join(" "));
      await page.keyboard.type(String.fromCharCode(13));
      await page.waitForSelector("#snipTextIcon");

      const reply = await page.evaluate(() => {
        /* eslint-disable no-undef */
        return [...document.querySelectorAll(".bot")].map(div => div.innerText);
        /* eslint-enable no-undef */
      });

      await browser.close();

      return msg.edit(reply[reply.length - 1]);
    });
  }
};
