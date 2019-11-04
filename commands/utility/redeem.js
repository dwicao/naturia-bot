const { RichEmbed } = require("discord.js");
const fetch = require("node-fetch");
const { prefix, authorId } = require("../../config");
const { getErrorMessage } = require("../../utils");

const runner = () =>
  fetch(`https://jsonbox.io/${process.env.JSONBOX_REDEEM_KEY}`).then(res =>
    res.json()
  );

module.exports = {
  runner,
  name: "redeem",
  description: "Redeem your rewards",
  args: true,
  usage: `<your-code> | Example \`${prefix}redeem 2Ea36gMfWxY73AA\` `,
  async execute(message, args) {
    const redeemResult = (await runner()) || [];

    if (authorId === message.author.id && args[0] === "create" && args[1]) {
      const matchedRedeem =
        redeemResult.filter(val => val.code === args[1])[0] || {};

      if (matchedRedeem && matchedRedeem.code) {
        return message.reply(
          `:x: Couldn't create that code because it was already exist`
        );
      } else {
        fetch(
          `https://jsonbox.io/${process.env.JSONBOX_REDEEM_KEY}/${args[1]}`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: `{"code": "${args[1]}"}`
          }
        )
          .then(res => res.json())
          .then(result => {
            if (result.code === args[1]) {
              return message.reply(
                `The code was successfully added to database.`
              );
            }

            return message.reply(getErrorMessage());
          })
          .catch(() => {
            return message.reply(getErrorMessage());
          });
      }

      return;
    }

    if (args[0] === "status" && args[1]) {
      const matchedRedeem =
        redeemResult.filter(val => val.code === args[1])[0] || {};

      if (matchedRedeem && matchedRedeem.code && matchedRedeem.winner) {
        return message.reply(
          `That code was already claimed by User ID: ${matchedRedeem.winner}`
        );
      }

      if (matchedRedeem && matchedRedeem.code && !matchedRedeem.winner) {
        return message.reply("That code is still redeemable.");
      }

      return message.reply(`That code is didn't exist.`);
    }

    const matchedRedeem =
      redeemResult.filter(val => val.code === args[0])[0] || {};

    if (matchedRedeem && matchedRedeem.winner) {
      return message.reply(
        `:smiley: That code was already claimed by User ID: ${matchedRedeem.winner}`
      );
    }

    if (matchedRedeem && matchedRedeem.code && matchedRedeem.code === args[0]) {
      fetch(
        `https://jsonbox.io/${process.env.JSONBOX_REDEEM_KEY}/${matchedRedeem._id}`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: `{"code": "${matchedRedeem.code}", "winner": "${message.author.id}"}`
        }
      )
        .then(res => res.json())
        .then(result => {
          const successfullyUpdated = (result.message || "").includes(
            "updated"
          );

          if (successfullyUpdated) {
            return message.reply(`Congratulation! You won the giveaway :tada:`);
          }

          return message.reply(getErrorMessage());
        })
        .catch(() => {
          return message.reply(getErrorMessage());
        });
    }

    if (matchedRedeem && !matchedRedeem._id) {
      return message.reply(`Invalid code :bangbang:`);
    }
  }
};
