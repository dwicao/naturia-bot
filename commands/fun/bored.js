const fetch = require("node-fetch");
const { sendErrorMessage } = require("../../utils");

const runner = () =>
  fetch(`https://www.boredapi.com/api/activity`).then(response =>
    response.json()
  );

module.exports = {
  runner,
  name: "bored",
  description: "A command when you are bored",
  async execute(message, args) {
    const result = await runner();

    if (result && result.activity) {
      message.channel.send(result.activity);
    } else {
      sendErrorMessage(message);
    }
  }
};
