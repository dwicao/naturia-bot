const fetch = require("node-fetch");
const { sendErrorMessage } = require("../../utils");

const runner = () =>
  fetch(`https://uinames.com/api`).then(response => response.json());

module.exports = {
  runner,
  name: "name",
  description: "Generate a random name",
  async execute(message, args) {
    const result = await runner();

    if (
      result &&
      result.name &&
      result.surname &&
      result.gender &&
      result.region
    ) {
      return message.channel.send(
        `${result.name} ${result.surname} (${result.gender}) - ${result.region}`
      );
    } else {
      return sendErrorMessage(message);
    }
  }
};
