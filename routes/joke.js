const { runner } = require("../commands/fun/joke");

const joke = async (req, res) => {
  const { setup, punchline } = await runner();

  res.render("joke", { description: `${setup} ${punchline}` });
};

module.exports = joke;
