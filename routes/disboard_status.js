const { runner, render } = require("../commands/utility/disboard-status");

const { DS_CHANNEL_ID, DS_KEY } = process.env;

const disboard_status = async (req, res, client) => {
  if (req.query.key === DS_KEY) {
    const { text, ready } = await runner();

    if (ready) {
      return client.channels
        .get(DS_CHANNEL_ID)
        .send(render({ text, ready }))
        .then(() => {
          res.sendStatus(200);
        })
        .catch(() => {
          res.sendStatus(500);
        });
    } else {
      res.sendStatus(200);
    }
  } else {
    res.sendStatus(400);
  }
};

module.exports = disboard_status;
