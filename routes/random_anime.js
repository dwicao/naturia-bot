const { RichEmbed } = require("discord.js");

const { runner, render } = require("../commands/utility/random-anime");

const { RA_CHANNEL_ID, RA_KEY } = process.env;

const random_anime = async (req, res, client) => {
  if (req.query.key === RA_KEY) {
    const animeInfo = await runner();

    return client.channels
      .get(RA_CHANNEL_ID)
      .send(
        new RichEmbed()
          .setColor(`RANDOM`)
          .attachFiles([animeInfo.thumbnail])
          .setDescription(render(animeInfo))
          .setFooter(animeInfo.description)
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

module.exports = random_anime;
