const { RichEmbed } = require("discord.js");
const fetch = require("node-fetch");
const { prefix } = require("../../config");

const RATES = [
  "CAD",
  "HKD",
  "ISK",
  "PHP",
  "DKK",
  "HUF",
  "CZK",
  "GBP",
  "RON",
  "SEK",
  "IDR",
  "INR",
  "BRL",
  "RUB",
  "HRK",
  "JPY",
  "THB",
  "CHF",
  "EUR",
  "MYR",
  "BGN",
  "TRY",
  "CNY",
  "NOK",
  "NZD",
  "ZAR",
  "USD",
  "MXN",
  "SGD",
  "AUD",
  "ILS",
  "KRW",
  "PLN"
];

module.exports = {
  name: "currency",
  description: "Foreign exchange rates",
  aliases: ["cur"],
  args: true,
  usage: "10 USD to IDR",
  async execute(message, args) {
    const normalizedArgs = args.map(arg => (arg || "").toUpperCase());
    const isCorrectRates = RATES.includes(normalizedArgs[3]);
    const isCorrectUsage =
      !isNaN(args[0]) &&
      args.length === 4 &&
      normalizedArgs[2] === "TO" &&
      isNaN(args[1]) &&
      isNaN(args[3]);

    if (isCorrectUsage) {
      if (!isCorrectRates) {
        const embed = new RichEmbed()
          .setColor(`RANDOM`)
          .setDescription(`Rate '${normalizedArgs[3]}' is not supported.`);

        return message.channel.send(embed);
      }

      const exchangeInfo =
        (await fetch(
          `https://api.exchangeratesapi.io/latest?base=${normalizedArgs[1]}`
        )
          .then(res => res.json())
          .catch(console.error)) || {};

      if (exchangeInfo.error) {
        const embed = new RichEmbed()
          .setColor(`RANDOM`)
          .setDescription(`${exchangeInfo.error}`);

        return message.channel.send(embed);
      }

      const result = Math.floor(
        Number(normalizedArgs[0]) *
          (exchangeInfo.rates || {})[normalizedArgs[3]]
      );

      const embed = new RichEmbed()
        .setColor(`RANDOM`)
        .setDescription(
          `${normalizedArgs[0]} ${normalizedArgs[1]} = ${result} ${
            normalizedArgs[3]
          }`
        )
        .setFooter(`Updated: ${exchangeInfo.date}`);

      return message.channel.send(embed);
    }

    message.reply(`the correct usage is: \`${prefix}cur 10 USD to IDR\``);
  }
};
