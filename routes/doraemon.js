const { runner } = require("../commands/fun/doraemon-today");

const doraemon = async (req, res) => {
  const { image, description } = await runner();
  res.render("doraemon", { image, description });
};

module.exports = doraemon;
