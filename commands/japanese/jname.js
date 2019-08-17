const request = require("request");
const cheerio = require("cheerio");
const { RichEmbed } = require("discord.js");
const { prefix } = require("../../config");
const { getHeaders } = require("../../utils");

const runner = gender =>
  new Promise((resolve, reject) => {
    const MALE_URL = `https://namegen.jp/en?country=japan&sex=male&firstname=&firstname_cond=fukumu&firstname_rarity=&lastname=&lastname_cond=fukumu&lastname_rarity=`;
    const FEMALE_URL = `https://namegen.jp/en?country=japan&sex=female&firstname=&firstname_cond=fukumu&firstname_rarity=&lastname=&lastname_cond=fukumu&lastname_rarity=`;

    const url = gender === "female" ? FEMALE_URL : MALE_URL;

    const options = {
      url,
      headers: getHeaders()
    };

    request(options, (error, response, data) => {
      if (error) {
        reject(error);
      }

      const $ = cheerio.load(data);

      const _name = $(".name")
        .text()
        .trim()
        .match(/\S+/g);

      const _kanjiName = $(".name-in-japanese")
        .text()
        .trim()
        .match(/\S+/g);

      const _pronunciation = $(".pron")
        .text()
        .trim()
        .match(/\S+/g);

      const secondName = _name.slice(0, 2);

      const lastName = secondName[1].match(/([A-Z]?[^A-Z]*)/g).slice(0, -1)[0];

      const name = `${secondName[0]} ${lastName}`;

      const kanji = _kanjiName.slice(0, 2).join(" ");

      const pronunciation = _pronunciation.slice(0, 2).join(" ");

      resolve({
        _response: response,
        url: {
          male: MALE_URL,
          female: FEMALE_URL
        },
        name,
        kanji,
        pronunciation
      });
    });
  });

module.exports = {
  runner,
  name: "jname",
  description: "Generate a random japanese name",
  args: true,
  usage: `male or ${prefix}jname female`,
  async execute(message, args) {
    const result = await runner(args[0]);

    const embed = new RichEmbed()
      .setColor(`RANDOM`)
      .addField("Name", result.name, true)
      .addField("Kanji name", result.kanji, true)
      .addField("Pronunciation", result.pronunciation, true);

    message.channel.send(embed);
  }
};
