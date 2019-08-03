module.exports = {
  name: 'waifu',
  description: 'A random waifu picture (generated by AI)',
  execute(message, args) {
    const MIN = 0;
    const MAX = 199999;
    const randNum = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;

    const imageSource = `https://www.thiswaifudoesnotexist.net/example-${randNum}.jpg`;

    if (imageSource) {
      return message.channel.send(
        'Here is your random waifu (generated by AI)',
        {
          files: [imageSource],
        }
      );
    }

    message.channel.send('Fetching Error! Please Try Again.');
  },
};