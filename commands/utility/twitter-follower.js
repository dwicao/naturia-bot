const puppeteer = require("puppeteer");
const {
  getRootDir,
  getUserAgent,
  getRandomInt,
  getUUID,
  getRandomHugeProxy,
  ProgressText
} = require("../../utils");
const { prefix } = require("../../config");

const document = {};
const localStorage = {};

module.exports = {
  name: "twitter-follower",
  aliases: ["tf"],
  description: "Generate a twitter account and follow a person",
  args: true,
  usage: "<username>",
  devOnly: true,
  async execute(message, args) {
    const progressText = new ProgressText();
    progressText.init(50);

    const randomStr = getUUID();

    const URL = "https://twitter.com/i/flow/signup";
    const URL_TWITTER_TARGET = `https://twitter.com/${args[0]}`;

    const proxy = await getRandomHugeProxy(URL);
    const browser = await puppeteer.launch({
      args: [
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
        "--no-first-run",
        "--no-sandbox",
        "--no-zygote",
        `--proxy-server=${proxy}`
      ],
      headless: false
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

        await page.focus("input[name=name]");
        msg.edit(progressText.update());
        await page.keyboard.type("rein");
        msg.edit(progressText.update());

        const use_email_instead_element = await page.$x(
          "//span[contains(., 'email instead')]"
        );
        msg.edit(progressText.update());
        if (use_email_instead_element.length) {
          await use_email_instead_element[0].click();
          msg.edit(progressText.update());
        }

        await page.focus("input[name=email]");
        msg.edit(progressText.update());
        await page.keyboard.type(`${randomStr}@ahem.email`);
        msg.edit(progressText.update());

        await page.waitFor(1500);
        msg.edit(progressText.update());
        const next_btn_selector = "//span[contains(., 'Next')]";
        const next_btn_element = await page.$x(next_btn_selector);
        msg.edit(progressText.update());
        if (next_btn_element.length) {
          await next_btn_element[0].click();
          msg.edit(progressText.update());
        }

        await page.waitFor(1500);
        msg.edit(progressText.update());
        const next_btn_element2 = await page.$x(next_btn_selector);
        msg.edit(progressText.update());
        if (next_btn_element2.length) {
          await next_btn_element2[0].click();
          msg.edit(progressText.update());
        }

        await page.waitFor(1500);
        msg.edit(progressText.update());
        const signup_btn_selector = await page.$x(
          "//span[contains(., 'Sign up')]"
        );
        msg.edit(progressText.update());
        if (signup_btn_selector.length) {
          await signup_btn_selector[0].click();
          msg.edit(progressText.update());
        }

        await page.waitFor(1500);
        msg.edit(progressText.update());

        // start open email
        const page2 = await browser.newPage();
        msg.edit(progressText.update());
        await page2.goto(`https://www.ahem.email/mailbox/${randomStr}`, {
          waitUntil: "networkidle0"
        });
        msg.edit(progressText.update());

        const first_email = await page2.$x("//h2[contains(., 'Twitter')]");
        msg.edit(progressText.update());
        if (first_email.length) {
          await first_email[0].click();
          msg.edit(progressText.update());
        }

        await page2.waitFor(5000);
        msg.edit(progressText.update());

        const verfication_code = await page2.evaluate(() => {
          return document.querySelector(
            "body > app-root > app-mailbox-emails > div > app-email-view > div > div > div > div > mat-card:nth-child(3) > mat-card-content > div > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td > table:nth-child(1) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(10) > td"
          ).innerText;
        });
        msg.edit(progressText.update());
        await page2.close();
        msg.edit(progressText.update());
        // close email

        await page.focus("input[name=verfication_code]");
        msg.edit(progressText.update());
        await page.keyboard.type(verfication_code);
        msg.edit(progressText.update());

        await page.waitFor(1500);
        msg.edit(progressText.update());
        const next_btn_element3 = await page.$x(next_btn_selector);
        msg.edit(progressText.update());
        if (next_btn_element3.length) {
          await next_btn_element3[0].click();
          msg.edit(progressText.update());
        }

        await page.waitFor(1500);
        msg.edit(progressText.update());
        await page.focus("input[name=password]");
        msg.edit(progressText.update());
        await page.keyboard.type("(rein)carnation#0707");
        msg.edit(progressText.update());

        await page.waitFor(1500);
        msg.edit(progressText.update());
        const next_btn_element4 = await page.$x(next_btn_selector);
        msg.edit(progressText.update());
        if (next_btn_element4.length) {
          await next_btn_element4[0].click();
          msg.edit(progressText.update());
        }
        await page.waitFor(3000);
        msg.edit(progressText.update());

        const page3 = await browser.newPage();
        msg.edit(progressText.update());
        await page3.goto(URL_TWITTER_TARGET, {
          waitUntil: "networkidle0"
        });
        msg.edit(progressText.update());

        const restricted_btn_locator = await page3.$x(
          "//span[contains(., 'Yes, view profile')]"
        );
        msg.edit(progressText.update());
        try {
          restricted_btn_locator[0].click();
          msg.edit(progressText.update());
          // eslint-disable-next-line no-empty
        } catch (err) {}

        await page3.waitFor(3000);
        msg.edit(progressText.update());

        const follow_btn_locator = await page3.$x(
          "//span[contains(., 'Follow')]"
        );
        msg.edit(progressText.update());
        if (follow_btn_locator.length) {
          await follow_btn_locator[0].click();
          msg.edit(progressText.update());
        }

        await page3.waitFor(1000);
        msg.edit(progressText.update());
        await page3.screenshot({
          path: `${getRootDir()}/public/twitter.jpg`,
          type: "jpeg",
          fullPage: true
        });
        msg.edit(progressText.update());

        await browser.close();
        msg.edit(progressText.update());

        return message.channel
          .send(
            `:white_check_mark: Succeed to follow ${args[0]}, <@${
              message.author.id
            }>`,
            {
              files: [{ attachment: `${getRootDir()}/public/twitter.jpg` }]
            }
          )
          .then(() => {
            msg.delete(5000);
          });
      })
      .catch(async error => {
        console.error(error);

        await page.screenshot({
          path: `${getRootDir()}/public/twitter.jpg`,
          type: "jpeg",
          fullPage: true
        });

        await browser.close();

        return message.channel.send(
          `:x: <@${message.author.id}>, Unexpected error was happened`,
          {
            files: [{ attachment: `${getRootDir()}/public/twitter.jpg` }]
          }
        );
      });
  }
};
