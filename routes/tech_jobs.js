const { RichEmbed } = require("discord.js");

const { runner, render } = require("../commands/utility/tech-jobs");

const { TJ_CHANNEL_ID, TJ_KEY } = process.env;

const tech_jobs = async (req, res, client) => {
  if (req.query.key === TJ_KEY) {
    const result = await runner();

    render(result).forEach(({ description, longago }, i) => {
      if ((longago || "").includes("h ago")) {
        client.channels.get(TJ_CHANNEL_ID).send(
          new RichEmbed()
            .setColor(`#008000`)
            .setThumbnail(result.logo_sources[i])
            .setDescription(description)
        );
      }
    });

    return client.channels
      .get(TJ_CHANNEL_ID)
      .send(
        new RichEmbed()
          .setColor(`#ff6600`)
          .setTimestamp()
          .setFooter(`Source: Tech In Asia`)
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

module.exports = tech_jobs;
