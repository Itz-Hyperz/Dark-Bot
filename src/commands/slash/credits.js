exports.run = async function(client, con, interaction, data, language) {
    let embed = new client.discord.MessageEmbed()
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .setColor(data.themecolor || '#FFFFFF')
    .setDescription(client.pages.reverse()[0])
    await interaction.reply({ embeds: [embed], ephemeral: client.config.commands.ephemeral });
};

exports.info = {
    "name": "credits",
    "description": "View the credits for this bot!"
}