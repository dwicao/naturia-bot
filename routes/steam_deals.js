const { RichEmbed } = require("discord.js");

const { runner, render } = require("../commands/utility/steam-deals");

const { SD_CHANNEL_ID, SD_KEY } = process.env;

const steam_deals = async (req, res, client) => {
  if (req.query.key === SD_KEY) {
    const result = await runner();

    if (result && result.titles && result.titles.length) {
      client.channels
        .get(SD_CHANNEL_ID)
        .send(
          new RichEmbed()
            .setColor(`#ff6600`)
            .setDescription(`**STEAM Deals Today**`)
        );

      render(result).forEach(({ footer, thumbnail, description }) => {
        client.channels.get(SD_CHANNEL_ID).send(
          new RichEmbed()
            .setColor(`#008000`)
            .setFooter(footer)
            .setImage(thumbnail)
            .setDescription(description)
        );
      });

      return client.channels
        .get(SD_CHANNEL_ID)
        .send(
          new RichEmbed()
            .setColor(`#ff6600`)
            .setTimestamp()
            .setFooter(`Source: gg.deals`)
        )
        .then(() => {
          res.sendStatus(200);
        })
        .catch(() => {
          res.sendStatus(500);
        });
    } else {
      return client.channels
        .get(SD_CHANNEL_ID)
        .send(
          new RichEmbed()
            .setColor(`#ff6600`)
            .setDescription("Unfortunately there are no deals for today :(")
        )
        .then(() => {
          res.sendStatus(200);
        })
        .catch(() => {
          res.sendStatus(500);
        });
    }
  } else {
    res.sendStatus(400);
  }
};

module.exports = steam_deals;
