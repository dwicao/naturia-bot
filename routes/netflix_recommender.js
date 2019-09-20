const { RichEmbed } = require("discord.js");

const { runner, render } = require("../commands/utility/netflix-recommender");

const { NR_CHANNEL_ID, NR_KEY } = process.env;

const netflix_recommender = async (req, res, client) => {
  if (req.query.key === NR_KEY) {
    const jsonRes = await runner();

    const imgSrc = `https://img.reelgood.com/content/movie/${jsonRes.id}/poster-780.jpg`;

    return client.channels
      .get(NR_CHANNEL_ID)
      .send(
        new RichEmbed()
          .setColor(`RANDOM`)
          .setTitle(jsonRes.title)
          .attachFiles([imgSrc])
          .setDescription(render(jsonRes))
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

module.exports = netflix_recommender;
