const {
  runner: wotdRunner,
  render: wotdRender
} = require("./commands/fun/wotd");

const { WOTD_CHANNEL_ID, WOTD_KEY } = process.env;

const root = (req, res) => {
  res.sendStatus(200);
};

const wotd = async (req, res, client) => {
  if (req.query.key === WOTD_KEY) {
    const _wotd = await wotdRunner();

    return client.channels
      .get(WOTD_CHANNEL_ID)
      .send(wotdRender(_wotd))
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

module.exports = {
  root,
  wotd
};
