exports.run = async function(client, con, interaction, data, language) {

    const menu = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageSelectMenu()
            .setCustomId('birthdaySelect')
            .setPlaceholder(language.birthdays.selectAction)
            .addOptions([
                {
                    label: language.birthdays.addBirthday,
                    description: language.birthdays.addBirthdayDescription,
                    value: 'birthdayAdd',
                },
                {
                    label: language.birthdays.removeBirthday,
                    description: language.birthdays.removeBirthdayDescription,
                    value: 'birthdayRemove',
                }
            ]),
    );
    let embed = new client.discord.MessageEmbed()
    .setColor(data.themecolor || '#FFFFFF')
    .setTitle(language.birthdays.embedTitle)
    .setDescription(language.birthdays.embedDescription)
    .setTimestamp()
    await interaction.reply({ embeds: [embed], components: [menu, client.refreshButton], ephemeral: true }).catch(e => {});

}

exports.info = {
    "name": "birthdays",
    "description": "Open the birthdays panel."
}