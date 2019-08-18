const puppeteer = require("puppeteer");
const { prefix } = require("../../config");

const LANGS = [
  "af",
  "id",
  "ms",
  "ca",
  "cs",
  "da",
  "de",
  "en",
  "es",
  "eu",
  "ti",
  "fr",
  "gl",
  "hr",
  "zu",
  "is",
  "it",
  "lt",
  "hu",
  "nl",
  "no",
  "pl",
  "pt",
  "ro",
  "sl",
  "fi",
  "sv",
  "vi",
  "tr",
  "el",
  "bg",
  "ru",
  "sr",
  "uk",
  "ko",
  "zh",
  "ja",
  "hi",
  "th"
];

const runner = async (text, hasLangArgs) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"]
  });

  const page = await browser.newPage();

  await page.goto("https://www.cleverbot.com/", {
    waitUntil: "domcontentloaded"
  });

  await page.waitFor("input[name=stimulus]");

  if (hasLangArgs) {
    await page.click('img[id="actionsicon"]');

    await page.select(
      "#conversationcontainer form select",
      text.split(" ")[0].toLowerCase()
    );
  }

  await page.focus("input[name=stimulus]");

  await page.keyboard.type(text);

  await page.keyboard.type(String.fromCharCode(13));

  await page.waitForSelector("#snipTextIcon");

  const reply = await page.evaluate(() => {
    /* eslint-disable no-undef */
    return [...document.querySelectorAll(".bot")].map(div => div.innerText);
    /* eslint-enable no-undef */
  });

  await browser.close();

  return reply[reply.length - 1];
};

module.exports = {
  runner,
  name: "talk",
  description: "Talk with me (Naturia)",
  args: true,
  usage: `<country_code> <your_message> | Example: \`${prefix}talk en how are you?\` | \`${prefix}t id apa kabar?\``,
  cooldown: 5,
  aliases: ["t"],
  execute(message, args) {
    return message.channel.send(":thinking: (thinking...)").then(async msg => {
      const hasLangArgs =
        args &&
        args.length &&
        args[1] &&
        LANGS.indexOf(args[1].toLowerCase()) !== -1;

      const browser = await puppeteer.launch({
        args: ["--no-sandbox"]
      });

      const page = await browser.newPage();

      await page.goto("https://www.cleverbot.com/", {
        waitUntil: "domcontentloaded"
      });

      await page.waitFor("input[name=stimulus]");

      if (hasLangArgs) {
        await page.click('img[id="actionsicon"]');

        await page.select(
          "#conversationcontainer form select",
          args[1].toLowerCase()
        );
      }

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
