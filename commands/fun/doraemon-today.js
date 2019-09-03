const { RichEmbed } = require("discord.js");
const fetch = require("node-fetch");
const { sendErrorMessage } = require("../../utils");

const runner = async () => {
  const result = await fetch(
    `https://www.instagram.com/doraemon_hari_ini/?__a=1`
  )
    .then(res => res.json())
    .then(response => response);

  const image =
    result &&
    result.graphql &&
    result.graphql.user &&
    result.graphql.user.edge_owner_to_timeline_media &&
    result.graphql.user.edge_owner_to_timeline_media.edges &&
    result.graphql.user.edge_owner_to_timeline_media.edges.length &&
    result.graphql.user.edge_owner_to_timeline_media.edges[0] &&
    result.graphql.user.edge_owner_to_timeline_media.edges[0].node &&
    result.graphql.user.edge_owner_to_timeline_media.edges[0].node.display_url;
  const description =
    result &&
    result.graphql &&
    result.graphql.user &&
    result.graphql.user.edge_owner_to_timeline_media &&
    result.graphql.user.edge_owner_to_timeline_media.edges &&
    result.graphql.user.edge_owner_to_timeline_media.edges.length &&
    result.graphql.user.edge_owner_to_timeline_media.edges[0] &&
    result.graphql.user.edge_owner_to_timeline_media.edges[0].node &&
    result.graphql.user.edge_owner_to_timeline_media.edges[0].node
      .edge_media_to_caption &&
    result.graphql.user.edge_owner_to_timeline_media.edges[0].node
      .edge_media_to_caption.edges &&
    result.graphql.user.edge_owner_to_timeline_media.edges[0].node
      .edge_media_to_caption.edges[0] &&
    result.graphql.user.edge_owner_to_timeline_media.edges[0].node
      .edge_media_to_caption.edges[0].node &&
    result.graphql.user.edge_owner_to_timeline_media.edges[0].node
      .edge_media_to_caption.edges[0].node.text &&
    result.graphql.user.edge_owner_to_timeline_media.edges[0].node.edge_media_to_caption.edges[0].node.text.replace(
      /⠀/g,
      ""
    );

  return {
    image,
    description
  };
};

module.exports = {
  runner,
  name: "doraemon-today",
  aliases: ["dt"],
  description: "Get a doraemon meme each day",
  cooldown: 60,
  async execute(message, args) {
    const { image, description } = await runner();

    if (image && description) {
      const getImage = () => fetch(image).then(res => res.buffer());
      const imageBuffer = await getImage();

      return message.channel.send(description, {
        files: [{ attachment: imageBuffer }]
      });
    }

    return sendErrorMessage(message);
  }
};
