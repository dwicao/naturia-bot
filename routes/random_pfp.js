const { RichEmbed } = require("discord.js");

const { runner } = require("../commands/fun/pfp");

const { PFP_CHANNEL_ID, PFP_KEY } = process.env;

const random_pfp = async (req, res, client) => {
  if (req.query.key === PFP_KEY) {
    const imageSource = await runner();

    return client.channels
      .get(PFP_CHANNEL_ID)
      .send({ files: [imageSource] })
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

module.exports = random_pfp;
