const { RichEmbed } = require("discord.js");

const { runner, render } = require("../commands/utility/javascript-trending");

const { JT_CHANNEL_ID, JT_KEY } = process.env;

const javascript_trending = async (req, res, client) => {
  if (req.query.key === JT_KEY) {
    const result = await runner();

    client.channels
      .get(JT_CHANNEL_ID)
      .send(
        new RichEmbed()
          .setColor(`#ff6600`)
          .setDescription(`**Trending Javascript Repositories Today**`)
      );

    render(result).forEach(value => {
      client.channels
        .get(JT_CHANNEL_ID)
        .send(new RichEmbed().setColor(`#008000`).setDescription(value));
    });

    return client.channels
      .get(JT_CHANNEL_ID)
      .send(
        new RichEmbed()
          .setColor(`#ff6600`)
          .setTimestamp()
          .setFooter(`Source: Github Trending`)
      )
      .then(() => {
        res.sendStatus(200);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(400);
  }
};

module.exports = javascript_trending;
