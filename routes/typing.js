const { runner, variable } = require("../commands/fun/typing");

const { TYPING_CHANNEL_ID, TYPING_KEY } = process.env;

const typing = async (req, res, client) => {
  if (req.query.key === TYPING_KEY) {
    const { image, words } = await runner();
    const previousAnswer = variable.getWords()
      ? `_Previous answer is \`${variable.getWords()}\`_\nPlease type corresponding 2 words below:`
      : "";

    return client.channels
      .get(TYPING_CHANNEL_ID)
      .send(previousAnswer, { files: [image] })
      .then(() => {
        variable.setWords(words);
        res.sendStatus(200);
      })
      .catch(() => {
        variable.setWords(words);
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(400);
  }
};

module.exports = typing;
