const fetch = require("node-fetch");

const runner = firstName =>
  fetch(`https://api.genderize.io/?name=${firstName}`).then(response =>
    response.json()
  );

module.exports = {
  runner,
  name: "gender",
  description: "Check gender from a name",
  args: true,
  usage: "john",
  async execute(message, args) {
    const firstName = message.content.split(" ")[1];
    const fullName = message.content.slice(9);

    const result = await runner(firstName);

    const unknownMessage = `Hmmm... I can't guess if ${fullName} is a male/female`;

    const genderMessage = `${fullName} is a ${
      result.gender
    }, probability: ${result.probability * 100}%`;

    return message.channel.send(result.gender ? genderMessage : unknownMessage);
  }
};
