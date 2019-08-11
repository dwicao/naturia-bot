const request = require("request");
const cheerio = require("cheerio");
const { RichEmbed } = require("discord.js");
const { prefix } = require("../../config");
const { getHeaders } = require("../../utils");

module.exports = {
  name: "jname",
  description: "Generate a random japanese name",
  args: true,
  usage: `male or ${prefix}jname female`,
  execute(message, args) {
    const MALE_URL = `https://namegen.jp/en?country=japan&sex=male&firstname=&firstname_cond=fukumu&firstname_rarity=&lastname=&lastname_cond=fukumu&lastname_rarity=`;
    const FEMALE_URL = `https://namegen.jp/en?country=japan&sex=female&firstname=&firstname_cond=fukumu&firstname_rarity=&lastname=&lastname_cond=fukumu&lastname_rarity=`;

    const url = args[0] === "female" ? FEMALE_URL : MALE_URL;

    const options = {
      url,
      headers: getHeaders()
    };

    request(options, (error, response, data) => {
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

      const kanjiName = _kanjiName.slice(0, 2).join(" ");

      const pronunciation = _pronunciation.slice(0, 2).join(" ");

      const embed = new RichEmbed()
        .setColor(`RANDOM`)
        .addField("Name", name, true)
        .addField("Kanji name", kanjiName, true)
        .addField("Pronunciation", pronunciation, true);

      message.channel.send(embed);
    });
  }
};
