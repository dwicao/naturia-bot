const puppeteer = require("puppeteer");
const fetch = require("node-fetch");
const {
  getRootDir,
  getUserAgent,
  getRandomInt,
  ProgressText,
  getParameterByName,
  promiseTimeout
} = require("../../utils");
const { prefix } = require("../../config");

const document = {};
const APIKEY = process.env.TWOCAPTCHA_APIKEY;

module.exports = {
  name: "recaptcha-solver",
  aliases: ["rs"],
  description: "recaptcha-solver",
  devOnly: true,
  async execute(message, args) {
    const URL = "https://www.google.com/recaptcha/api2/demo";

    const browser = await puppeteer.launch({
      args: ["--no-sandbox"]
    });

    const page = await browser.newPage();

    message.channel
      .send("Loading...")
      .then(async msg => {
        await page.setUserAgent(getUserAgent());

        await page.setViewport({ width: 1366, height: 768 });

        await page.goto(URL, {
          waitUntil: "networkidle0"
        });

        const iframeSrc = await page.$$eval("iframe[src]", aTags =>
          aTags.map(a => a.getAttribute("src"))
        );

        const matchedIframeSrc = (iframeSrc || []).filter(item =>
          (item || "").includes("recaptcha/api2/anchor")
        )[0];

        const key = getParameterByName(matchedIframeSrc, "k");

        const optIn = `https://2captcha.com/in.php?key=${APIKEY}&method=userrecaptcha&googlekey=${key}&pageurl=${URL}&json=1`;

        const resultIn = await fetch(optIn).then(response => response.json());

        const uriRes = `https://2captcha.com/res.php?key=${APIKEY}&action=get2&id=${resultIn.request}&json=1`;

        const resultRes = await fetch(uriRes, { timeout: 20000 }).then(
          response => response.json()
        );

        let result = resultRes.request;

        const reFetch = () => fetch(uriRes, { timeout: 20000 });

        function next() {
          return reFetch()
            .then(response => response.json())
            .then(res => {
              if (res.request === "CAPCHA_NOT_READY") {
                return next();
              } else {
                return res;
              }
            });
        }

        await next()
          .then(res => {
            result = res.request;
          })
          .catch(console.error);

        await page.evaluate(_result => {
          document.getElementById("g-recaptcha-response").innerHTML = _result;
        }, result);

        await page.evaluate(_result => {
          document.querySelector("#recaptcha-demo-submit").click();
        }, result);

        await page.waitForNavigation();

        await page.screenshot({
          path: `${getRootDir()}/public/spotify.jpg`,
          type: "jpeg",
          fullPage: true
        });

        await browser.close();

        return message.channel
          .send({
            files: [{ attachment: `${getRootDir()}/public/spotify.jpg` }]
          })
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
          `:x: <@${message.author.id}>, Unexpected error was happened`,
          {
            files: [{ attachment: `${getRootDir()}/public/spotify.jpg` }]
          }
        );
      });
  }
};
