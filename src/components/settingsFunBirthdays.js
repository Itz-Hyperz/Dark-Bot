module.exports = async function(client, con, interaction, data, language, gohome) {
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.toggle)
        .setStyle('SECONDARY')
        .setCustomId('settingsFunToggleDisabled')
        .setDisabled(true)
    )
    let buttons2 = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.settings)
        .setStyle('SECONDARY')
        .setCustomId('settingsFunToggleDisabled2')
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunBirthdays.clear)
        .setStyle('DANGER')
        .setCustomId('settingsFunClearBdayData')
    )
    if(data.birthdays) {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.enabled)
            .setStyle('SUCCESS')
            .setCustomId('settingsFunToggleBirthdays')
        )
    } else {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.disabled)
            .setStyle('DANGER')
            .setCustomId('settingsFunToggleBirthdays')
        )
    }
    await interaction.update({ components: [buttons, buttons2, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};