const fetch = require("node-fetch");
const { RichEmbed } = require("discord.js");
const { limitString } = require("../../utils");

const runner = () =>
  fetch(
    "https://api.reelgood.com/roulette/netflix?availability=onAnySource&content_kind=movie&minimum_imdb=7&nocache=true"
  ).then(response => response.json());

const genres_data = {
  6: "Animation",
  39: "Anime",
  7: "Biography",
  8: "Children",
  9: "Comedy",
  10: "Crime",
  41: "Cult",
  11: "Documentary",
  3: "Drama",
  12: "Family",
  13: "Fantasy",
  15: "Food",
  16: "Game Show",
  17: "History",
  19: "Horror",
  43: "Independent",
  37: "LGBTQ",
  22: "Musical",
  23: "Mystery",
  25: "Reality",
  4: "Romance",
  26: "Science-Fiction",
  29: "Sport",
  45: "Stand-up & Talk",
  32: "Thriller",
  33: "Travel"
};

const render = ({ released_on, genres, imdb_rating, runtime, overview }) => {
  const year = (released_on || "").slice(0, 4);

  let genres_result = "| ";

  (genres || []).forEach((id, index) => {
    if (genres_data[id]) {
      genres_result += `${genres_data[id]} | `;
    }
  });

  return `${year}\nIMDB: ${imdb_rating}/10\n${runtime} minutes\n${genres_result}\n\n${limitString(
    overview,
    1920
  )}`;
};

module.exports = {
  runner,
  render,
  name: "netflix-recommender",
  description: "Get a random netflix movies",
  aliases: ["nr"],
  devOnly: true,
  async execute(message, args) {
    const jsonRes = await runner();

    const imgSrc = `https://img.reelgood.com/content/movie/${jsonRes.id}/poster-780.jpg`;

    const embeddedDefinition = new RichEmbed()
      .setColor(`RANDOM`)
      .setTitle(jsonRes.title)
      .attachFiles([imgSrc])
      .setDescription(render(jsonRes));

    return message.channel.send(embeddedDefinition);
  }
};
