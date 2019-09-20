const { runner, getEmbeds } = require("../commands/utility/hacker-news");

const { HN_CHANNEL_ID, HN_KEY } = process.env;

const hn = async (req, res, client) => {
  if (req.query.key === HN_KEY) {
    const titles = await runner();

    client.channels
      .get(HN_CHANNEL_ID)
      .send(getEmbeds(titles).one)
      .catch(() => {
        res.sendStatus(500);
      });

    client.channels
      .get(HN_CHANNEL_ID)
      .send(getEmbeds(titles).two)
      .catch(() => {
        res.sendStatus(500);
      });

    return client.channels
      .get(HN_CHANNEL_ID)
      .send(getEmbeds(titles).three)
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

module.exports = hn;
