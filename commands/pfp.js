const request = require('request');
const cheerio = require('cheerio');

module.exports = {
  name: 'pfp',
  description: 'Generate random profile picture',
  execute(message, args) {
    request('https://picrew.me', (error, response, data) => {
      const $ = cheerio.load(data);

      const imageSource = $(
        '.sitetop_discovery .sitetop_discovery_list_img img'
      ).attr('src');

      if (imageSource) {
        return message.channel.send('Here is your random profile picture.', {
          files: [imageSource],
        });
      }

      message.channel.send('Fetching Error! Please Try Again.');
    });
  },
};
