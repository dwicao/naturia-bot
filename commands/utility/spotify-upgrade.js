const puppeteer = require("puppeteer");
const {
  getRootDir,
  getUserAgent,
  getRandomInt,
  ProgressText
} = require("../../utils");
const { prefix } = require("../../config");

const document = {};

module.exports = {
  name: "spotify-upgrade",
  aliases: ["su"],
  description: "Upgrade your spotify account to premium",
  cooldown: 60,
  args: true,
  usage: `<email> | Example: ${prefix}spotify-upgrade john@example.com`,
  allowedRole: "spotify-upgrader-access",
  allowedChannelID: process.env.SPOTIFY_CHANNEL_ID,
  async execute(message, args) {
    const progressText = new ProgressText();
    progressText.init(20);

    const randomNum = getRandomInt(1, 999);

    const USERNAME = process.env.SPOTIFY_USERNAME;
    const PASSWORD = process.env.SPOTIFY_PASSWORD;

    const URL =
      "https://accounts.spotify.com/en/login/?continue=https:%2F%2Fwww.spotify.com%2Fen%2Faccount%2Foverview";

    const browser = await puppeteer.launch({
      args: ["--no-sandbox"]
    });

    const page = await browser.newPage();

    message.channel
      .send(progressText.update())
      .then(async msg => {
        await page.setUserAgent(getUserAgent());

        msg.edit(progressText.update());

        await page.setViewport({ width: 1366, height: 768 });

        msg.edit(progressText.update());

        await page.goto(URL, {
          waitUntil: "networkidle0"
        });

        msg.edit(progressText.update());

        await page.focus("input[id=login-username]");

        msg.edit(progressText.update());

        await page.keyboard.type(USERNAME);

        msg.edit(progressText.update());

        await page.focus("input[id=login-password]");

        msg.edit(progressText.update());

        await page.keyboard.type(PASSWORD);

        msg.edit(progressText.update());

        await page.click("button[id=login-button]");

        msg.edit(progressText.update());

        await page.waitForNavigation();

        msg.edit(progressText.update());

        await page.waitFor(
          "#account-csr-container > div > article:nth-child(5) > div > a",
          { visible: true }
        );
        await page.evaluate(() => {
          const PREMIUM_FOR_FAMILY_BUTTON =
            "#account-csr-container > div > article:nth-child(5) > div > a";
          if (document.querySelector(PREMIUM_FOR_FAMILY_BUTTON))
            document.querySelector(PREMIUM_FOR_FAMILY_BUTTON).click();
        });

        msg.edit(progressText.update());

        await page.waitFor(
          "#family-spa > div > div > div > div:nth-child(2) > div > section.section-invite-link > div > div > button",
          { visible: true }
        );
        await page.evaluate(() => {
          const START_INVITATION_BUTTON =
            "#family-spa > div > div > div > div:nth-child(2) > div > section.section-invite-link > div > div > button";
          if (document.querySelector(START_INVITATION_BUTTON))
            document.querySelector(START_INVITATION_BUTTON).click();
        });

        msg.edit(progressText.update());

        await page.waitForSelector(
          "#family-spa > div > div > div > div:nth-child(2) > div > section.section-invite-link > div > div > div > div > div > div.modal-footer > button.btn.btn-link.btn-sm.btn-modal-agree.autoFocus",
          { visible: true }
        );
        await page.evaluate(() => {
          const IM_AGREE_BUTTON =
            "#family-spa > div > div > div > div:nth-child(2) > div > section.section-invite-link > div > div > div > div > div > div.modal-footer > button.btn.btn-link.btn-sm.btn-modal-agree.autoFocus";
          if (document.querySelector(IM_AGREE_BUTTON))
            document.querySelector(IM_AGREE_BUTTON).click();
        });

        msg.edit(progressText.update());

        await page.focus("input[name=firstName]");

        await page.keyboard.type(`#${randomNum} rein`);

        msg.edit(progressText.update());

        await page.focus("input[name=lastName]");

        await page.keyboard.type("carnation");

        msg.edit(progressText.update());

        await page.focus("input[name=email]");

        await page.keyboard.type(args[0]);

        msg.edit(progressText.update());

        await page.keyboard.type(String.fromCharCode(13));

        const SUCCESS_MESSAGE =
          "#family-spa > div > div.alert.alert-family.alert-success > p";
        await page.waitForSelector(SUCCESS_MESSAGE, { visible: true });

        msg.edit(progressText.update());

        await page.screenshot({
          path: `${getRootDir()}/public/spotify.jpg`,
          type: "jpeg",
          fullPage: true
        });

        msg.edit(progressText.update());

        await browser.close();

        msg.edit(progressText.update());

        return message.channel
          .send(
            `:white_check_mark: Invitation #${randomNum} has been sent! Check your email, <@${message.author.id}>`,
            {
              files: [{ attachment: `${getRootDir()}/public/spotify.jpg` }]
            }
          )
          .then(() => {
            msg.delete(10000);
          });
      })
      .catch(async error => {
        console.error(error);

        await page.screenshot({
          path: `${getRootDir()}/public/spotify.jpg`,
          type: "jpeg",
          fullPage: true
        });

        await browser.close();

        return message.channel.send(
          `:x: <@${message.author.id}>, Unexpected error was happened, the invitation maybe already full, look at screenshot below`,
          {
            files: [{ attachment: `${getRootDir()}/public/spotify.jpg` }]
          }
        );
      });
  }
};
