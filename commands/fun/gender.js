const fetch = require("node-fetch");

module.exports = {
  name: "gender",
  description: "Check gender from a name",
  args: true,
  usage: "john",
  async execute(message, args) {
    const firstName = message.content.split(" ")[1];
    const fullName = message.content.slice(9);

    const json = await fetch(`https://api.genderize.io/?name=${firstName}`)
      .then(response => response.json())
      .catch(console.error);

    const unknownMessage = `Hmmm... I can't guess if ${fullName} is a male/female`;

    const genderMessage = `${fullName} is a ${
      json.gender
    }, probability: ${json.probability * 100}%`;

    message.channel.send(json.gender ? genderMessage : unknownMessage);
  }
};
