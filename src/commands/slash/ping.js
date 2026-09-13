exports.run = async function(client, con, interaction, data, language) {
    let embed = new client.discord.MessageEmbed()
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .setColor(data.themecolor || '#FFFFFF')
    .setDescription(`${language.ping.message} **${Date.now() - interaction.createdTimestamp}ms.**`)
    await interaction.reply({ embeds: [embed], ephemeral: client.config.commands.ephemeral });
};

exports.info = {
    "name": "ping",
    "description": "A simple ping command."
}