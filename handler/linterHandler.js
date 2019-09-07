/**
 * @author SharifPoetra
 * @description This code is open source you can check it in here : https://github.com/kakakikikuku/apakaumauliat/blob/master/handle/linter.js
 */

const { Linter } = require("eslint");
const linter = new Linter();
const { RichEmbed } = require("discord.js");
const bmsg = require("../assets/json/bad-message.json");

module.exports = async msg => {
  const input = msg.content
    .match(/```(js)?(.|\s)+```/gi)[0]
    .replace(/```(js|javascript)?|```/gi, "")
    .trim();
  const code = /\bawait\b/i.test(input)
    ? `(async function(){ \n${input}\n})()`
    : input;
  const errors = linter.verify(
    code,
    require("../assets/json/eslint-default.json")
  );
  if (errors.length < 1) return msg.react("✅");
  await msg.react("❌");
  msg.react("🔎");
  const errs = [];
  for (const e of errors) {
    errs.push(`- [${e.line}:${e.column}] ${e.message}`);
  }

  const filter = (rect, user) =>
    rect.emoji.name === "🔎" && user.id === msg.author.id;
  return msg
    .createReactionCollector(filter, { max: 1, time: 60000 })
    .on("collect", col => {
      const embed = new RichEmbed()
        .setColor("#FF0000")
        .addField("🚫 Errors", `\`\`\`diff\n${errs.join("\n")}\`\`\``)
        .addField("🔗Annotated Code", `\`\`\`${annotate(code, errors)}\`\`\``);
      msg.channel.send(
        `**${
          bmsg[Math.floor(Math.random() * bmsg.length) - 1]
        }**\n\n**🚫 Errors**\n\`\`\`diff\n${errs.join(
          "\n"
        )}\`\`\`\n\n**🔗Annotated Code**\n\`\`\`${annotate(code, errors)}\`\`\``
      );
    });
};

function annotate(code, errors) {
  let final = "";
  for (const error of errors) {
    const line = code.split("\n")[error.line - 1];
    const annotation = `${" ".repeat(error.column - 1)}^ `;
    const reason = `[${error.line}:${error.column}] ${error.message}`;
    final = `${final}${line}\n${annotation}\n${reason}`;
  }
  return final;
}
