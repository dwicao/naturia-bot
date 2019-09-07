/**
 * @author SharifPoetra
 * @description This code is open source you can check it in here : https://github.com/kakakikikuku/apakaumauliat/blob/master/handle/coliru.js
 */

const snek = require("node-superfetch");
const { postHastebin, codeblock } = require("../utils");

module.exports = async msg => {
  const src = msg.content
    .match(/```(cpp)?(.|\s)+```/gi)[0]
    .replace(/```(cpp)?|```/gi, "")
    .trim();
  await msg.react("✔");
  const filter = (rect, usr) => rect.emoji === "✔" && usr.id === msg.author.id;
  const m = await msg.channel.send("Compiling....");
  const response = await msg.awaitReactions(filter, {
    max: 1,
    time: 60000
  });
  if (!response.size) return undefined;
  try {
    let { text } = await snek
      .post("http://coliru.stacked-crooked.com/compile")
      .send({
        cmd: "g++ main.cpp && ./a.out",
        src
      });
    text = codeblock(text, "diff");
    if (text.length > 2000) text = await postHastebin(text);
    return m.edit(`
${msg.author.toString()}, Output :
\`\`\`
${text}
\`\`\`
`);
  } catch (e) {
    m.delete();
    return msg.reply(`Something went spoopy 👀 ${codeblock(e.stack, "ini")}`);
  }
};
