module.exports = {
  name: "ping",
  description: "Ping!",
  execute(message, args) {
    return message.channel.send("Pong.");
  }
};
