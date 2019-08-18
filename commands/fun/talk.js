const puppeteer = require("puppeteer");
const { getLoadingMessage } = require("../../utils");

// eslint-disable-next-line
const no_op = () => {};
const TOTAL_STEP = 11;

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

const runner = async (text, callback = no_op, hasLangArgs = false) => {
  callback(1, TOTAL_STEP);

  const browser = await puppeteer.launch({
    args: ["--no-sandbox"]
  });

  callback(2, TOTAL_STEP);

  const page = await browser.newPage();

  callback(3, TOTAL_STEP);

  await page.goto("https://www.cleverbot.com/", {
    waitUntil: "domcontentloaded"
  });

  callback(4, TOTAL_STEP);

  await page.waitFor("input[name=stimulus]");

  callback(5, TOTAL_STEP);

  // I think we don't need this code anymore
  // Because the cleverbot actually can detect the language
  if (hasLangArgs) {
    await page.click('img[id="actionsicon"]');

    await page.select(
      "#conversationcontainer form select",
      text.split(" ")[0].toLowerCase()
    );
  }

  await page.focus("input[name=stimulus]");

  callback(6, TOTAL_STEP);

  await page.keyboard.type(text);

  callback(7, TOTAL_STEP);

  await page.keyboard.type(String.fromCharCode(13));

  callback(8, TOTAL_STEP);

  await page.waitForSelector("#snipTextIcon");

  callback(9, TOTAL_STEP);

  const reply = await page.evaluate(() => {
    /* eslint-disable no-undef */
    return [...document.querySelectorAll(".bot")].map(div => div.innerText);
    /* eslint-enable no-undef */
  });

  callback(10, TOTAL_STEP);

  await browser.close();

  return reply[reply.length - 1];
};

module.exports = {
  runner,
  name: "talk",
  description: "Talk with me (Naturia)",
  args: true,
  usage: `how are you?`,
  cooldown: 5,
  aliases: ["t"],
  execute(message, args) {
    return message.channel.send(getLoadingMessage(0, 11)).then(async msg => {
      const hasLangArgs =
        args &&
        args.length &&
        args[1] &&
        LANGS.indexOf(args[1].toLowerCase()) !== -1;

      const sendLoadingMessage = (step, total_step) => {
        msg.edit(getLoadingMessage(step, total_step));
      };

      const reply = await runner(args.join(" "), sendLoadingMessage);

      msg.edit(getLoadingMessage(TOTAL_STEP, TOTAL_STEP));

      return msg.edit(reply);
    });
  }
};
