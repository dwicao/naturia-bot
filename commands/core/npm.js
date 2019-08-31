const { RichEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "npm",
  description: "Search npm package registry",
  async execute(message, args) {
    const runner = () =>
      fetch(`https://registry.npmjs.org/${args[0]}`).then(res => res.json());
    const result = await runner();
    if (result.error)
      return message.channel.send(
        `Package with name \`${args.join[0]}\` doesn't exists.`
      );
    const versionLatest = result["dist-tags"].latest;
    const latestVersionInfo = result.versions[versionLatest];
    const embed = new RichEmbed()
      .setTitle(`**${result.name}**`)
      .setURL(`https://www.npmjs.com/package/${result.name}`)
      .setColor("BLURPLE")
      .setDescription(latestVersionInfo.description)
      .addField("Author", latestVersionInfo.author.name)
      .addField(
        "Repository",
        latestVersionInfo.repository.url.replace("git+", "").replace(".git", "")
      )
      .addField("License", latestVersionInfo.license)
      .addField("Keywords", latestVersionInfo.keywords.join(", "))
      .setFooter(
        `• Requested by ${message.author.tag}`,
        message.author.displayAvatarURL
      )
      .setTimestamp();

    message.channel.send(embed);
  }
};
