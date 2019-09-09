const request = require("request");
const cheerio = require("cheerio");
const { RichEmbed } = require("discord.js");
const { getHeaders, sendErrorMessage } = require("../../utils");

const runner = () =>
  new Promise((resolve, reject) => {
    const url =
      "https://gg.deals/deals/?minGameRating=3&minRating=3&onlyBestDeal=1&onlyHistoricalLow=1&sort=date&store=4";

    const options = {
      url,
      headers: getHeaders()
    };

    request(options, (error, response, data) => {
      const titles = [];
      const timeagos = [];
      const tags = [];
      const percentageDiscounts = [];
      const discountedPrices = [];
      const realPrices = [];
      const ratingBadges = [];
      const thumbnails = [];
      const shopLinks = [];

      const $ = cheerio.load(data);
      const titleElements = $("a.ellipsis.title");
      const timeagoElements = $("time.timeago-short");
      const tagElements = $("div.tag-.ellipsis.tag");
      const percentageDiscountElements = $("span.discount-badge.badge");
      const discountedPriceElements = $("span.numeric");
      const realPriceElements = $("span.bottom");
      const ratingBadgeElements = $("span.rating-badge");
      const thumbnailElements = $("a.main-image img[src]");
      const shopLinkElements = $("a.shop-link.lowest-recorded");

      titleElements.each((i, element) => {
        const titleText = $(element)
          .text()
          .trim();

        titles.push(titleText);
      });

      timeagoElements.each((i, element) => {
        const timeagoText = $(element)
          .text()
          .trim();

        timeagos.push(timeagoText);
      });

      tagElements.each((i, element) => {
        const tagText = $(element)
          .text()
          .trim();

        tags.push(tagText);
      });

      percentageDiscountElements.each((i, element) => {
        const percentageDiscountText = $(element)
          .text()
          .trim();

        percentageDiscounts.push(percentageDiscountText);
      });

      discountedPriceElements.each((i, element) => {
        const discountedPriceText = $(element)
          .text()
          .trim();

        discountedPrices.push(discountedPriceText);
      });

      realPriceElements.each((i, element) => {
        const realPriceText = $(element)
          .text()
          .trim();

        realPrices.push(realPriceText);
      });

      ratingBadgeElements.each((i, element) => {
        const ratingBadgeText = $(element)
          .text()
          .trim();

        ratingBadges.push(ratingBadgeText);
      });

      thumbnailElements.each((i, element) => {
        const thumbnailSource = $(element).attr("src");

        thumbnails.push(thumbnailSource);
      });

      shopLinkElements.each((i, element) => {
        const shopLinkSource = $(element).attr("href");

        shopLinks.push(`https://gg.deals${shopLinkSource}`);
      });

      const howManyFreshDeals = timeagos.filter((value, index) =>
        (value || "").includes("h ago")
      );
      const getFreshDeals = arr => arr.slice(0, howManyFreshDeals.length);

      if (error) {
        reject(error);
      } else {
        resolve({
          titles: getFreshDeals(titles),
          tags: getFreshDeals(tags),
          percentageDiscounts: getFreshDeals(percentageDiscounts),
          discountedPrices: getFreshDeals(discountedPrices),
          realPrices: getFreshDeals(realPrices),
          ratingBadges: getFreshDeals(ratingBadges),
          thumbnails: getFreshDeals(thumbnails),
          shopLinks: getFreshDeals(shopLinks)
        });
      }
    });
  });

const render = ({
  titles,
  tags,
  percentageDiscounts,
  discountedPrices,
  realPrices,
  ratingBadges,
  thumbnails,
  shopLinks
}) => {
  const embedResult = [];

  titles.forEach((_title, i) => {
    const description = `[${_title}](${shopLinks[i]})\n${tags[i]}\n~~${realPrices[i]}~~\n**${discountedPrices[i]}** (${percentageDiscounts[i]})`;
    const footer = `[Deal Rating: ${ratingBadges[i]}/10]`;

    embedResult.push({
      thumbnail: thumbnails[i],
      description,
      footer
    });
  });

  return embedResult;
};

module.exports = {
  runner,
  render,
  name: "steam-deals",
  description: "Get list of STEAM deals today",
  aliases: ["sd"],
  devOnly: true,
  async execute(message, args) {
    const result = await runner();

    message.channel.send(
      new RichEmbed()
        .setColor(`#ff6600`)
        .setDescription(`**STEAM Deals Today**`)
    );

    render(result).forEach(({ footer, description, thumbnail }) => {
      message.channel.send(
        new RichEmbed()
          .setColor(`#008000`)
          .setFooter(footer)
          .setImage(thumbnail)
          .setDescription(description)
      );
    });

    return message.channel.send(
      new RichEmbed()
        .setColor(`#ff6600`)
        .setTimestamp()
        .setFooter(`Source: gg.deals`)
    );
  }
};
