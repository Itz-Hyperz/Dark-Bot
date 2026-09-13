exports.run = async function(client, con, interaction, data, language) {

    let menu = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageSelectMenu()
        .setCustomId('marriageSelect')
        .setPlaceholder(language.marriage.command.selectAction)
        .addOptions([
            {
                label: language.marriage.command.send,
                description: language.marriage.command.sendDesc,
                value: 'sendrequest',
            },
            {
                label: language.marriage.command.accept,
                description: language.marriage.command.acceptDesc,
                value: 'acceptproposal',
            },
            {
                label: language.marriage.command.deny,
                description: language.marriage.command.denyDesc,
                value: 'denyproposal',
            },
            {
                label: language.marriage.command.divorce,
                description: language.marriage.command.divorceDesc,
                value: 'divorce',
            }
        ]),
    )
    let embed = new client.discord.MessageEmbed()
    .setColor(data.themecolor || '#FFFFFF')
    .setTitle(language.marriage.command.embedTitle)
    .setDescription(language.marriage.command.embedDesc)
    .setTimestamp()
    await interaction.reply({ embeds: [embed], components: [menu, client.refreshButton], ephemeral: true });
}

exports.info = {
    "name": "marriage",
    "description": "View the marriage system ❤️!"
}