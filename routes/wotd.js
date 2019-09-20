const { runner, render } = require("../commands/fun/wotd");

const { WOTD_CHANNEL_ID, WOTD_KEY } = process.env;

const wotd = async (req, res, client) => {
  if (req.query.key === WOTD_KEY) {
    const _wotd = await runner();

    return client.channels
      .get(WOTD_CHANNEL_ID)
      .send(render(_wotd))
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

module.exports = wotd;
