const { RichEmbed } = require("discord.js");

const { runner } = require("../commands/utility/premium-users");

const { PREMIUM_USERS_CHANNEL_ID, PREMIUM_USERS_KEY } = process.env;

const premium_users = async (req, res, client) => {
  if (req.query.key === PREMIUM_USERS_KEY) {
    const result = await runner();

    if (result.longagos && result.longagos.length) {
      res.sendStatus(200);

      result.longagos.forEach((longago, i) => {
        if ((longago || "").includes("hours ago")) {
          const filename = `[${(result.links[i] || "").substring(
            result.links[i].indexOf("raw/") + "raw/".length
          )}.txt]`;

          return client.channels
            .get(PREMIUM_USERS_CHANNEL_ID)
            .send(`${result.titles[i]} ${filename}`, {
              files: [{ attachment: result.links[i] }]
            });
        }
      });
    }
  } else {
    res.sendStatus(400);
  }
};

module.exports = premium_users;
