const puppeteer = require("puppeteer");
const { RichEmbed } = require("discord.js");
const {
  getRootDir,
  addHttpPrefix,
  sendErrorMessage,
  getLoadingMessage,
  getAllContentsFromXPATH
} = require("../../utils");

const runner = async () => {
  const URL =
    "https://www.techinasia.com/jobs/search?country_name[]=Remote&country_name[]=Indonesia&job_category_name[]=Web%20Development&job_category_name[]=Mobile%20Development";

  const browser = await puppeteer.launch({
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--no-sandbox",
      "--no-zygote"
    ]
  });

  const page = await browser.newPage();

  await page.goto(URL, { waitUntil: "networkidle0" });

  const logo_xpath =
    "/html/body/div[1]/div/div[4]/div[2]/div[3]/div/div/div/div/div[5]/article/div/div[1]/div[1]/a/img";
  const logo_sources = await getAllContentsFromXPATH({
    page,
    expression: logo_xpath,
    type: "src"
  });

  const title_xpath =
    "/html/body/div[1]/div/div[4]/div[2]/div[3]/div/div/div/div/div[5]/article/div/div[1]/div[2]/div[1]/span[1]/b/a";
  const title_texts = await getAllContentsFromXPATH({
    page,
    expression: title_xpath,
    type: "innerText"
  });
  const title_links = await getAllContentsFromXPATH({
    page,
    expression: title_xpath,
    type: "href"
  });

  const longAgo_xpath =
    "/html/body/div[1]/div/div[4]/div[2]/div[3]/div/div/div/div/div[5]/article/div/div[2]/span";
  const longAgo_texts = await getAllContentsFromXPATH({
    page,
    expression: longAgo_xpath,
    type: "innerText"
  });

  const company_xpath =
    "/html/body/div[1]/div/div[4]/div[2]/div[3]/div/div/div/div/div[5]/article/div/div[2]/span";
  const company_texts = await getAllContentsFromXPATH({
    page,
    expression: company_xpath,
    type: "innerText"
  });
  const company_links = await getAllContentsFromXPATH({
    page,
    expression: company_xpath,
    type: "href"
  });

  const location_xpath =
    "/html/body/div[1]/div/div[4]/div[2]/div[3]/div/div/div/div/div[5]/article/div/div[1]/div[2]/div[3]";
  const location_texts = await getAllContentsFromXPATH({
    page,
    expression: location_xpath,
    type: "innerText"
  });

  const salary_xpath =
    "/html/body/div[1]/div/div[4]/div[2]/div[3]/div/div/div/div/div[5]/article/div/div[1]/div[2]/div[4]";
  const salary_texts = await getAllContentsFromXPATH({
    page,
    expression: salary_xpath,
    type: "innerText"
  });

  await browser.close();

  return {
    logo_sources,
    title_texts,
    title_links,
    longAgo_texts,
    company_texts,
    company_links,
    location_texts,
    salary_texts
  };
};

const render = ({
  logo_sources,
  title_texts,
  title_links,
  longAgo_texts,
  company_texts,
  company_links,
  location_texts,
  salary_texts
}) => {
  const embedDescriptions = [];

  longAgo_texts.forEach((longAgo, i) => {
    const description = `[${title_texts[i]}](${title_links[i]}) \n${company_texts[i]}\n${location_texts[i]}\n${salary_texts[i]}`;

    embedDescriptions.push({ description, longago: longAgo_texts[i] });
  });

  return embedDescriptions;
};

module.exports = {
  runner,
  render,
  name: "tech-jobs",
  aliases: ["tj"],
  description: "Get a list of tech jobs",
  devOnly: true,
  async execute(message, args) {
    const result = await runner();

    render(result).forEach(({ description, longago }, i) => {
      if ((longago || "").includes("h ago")) {
        message.channel.send(
          new RichEmbed()
            .setColor(`#008000`)
            .setThumbnail(result.logo_sources[i])
            .setDescription(description)
        );
      }
    });

    return message.channel.send(
      new RichEmbed()
        .setColor(`#ff6600`)
        .setTimestamp()
        .setFooter(`Source: Tech In Asia`)
    );
  }
};
