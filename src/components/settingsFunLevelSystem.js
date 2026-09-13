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
        .setLabel(language.components.settingsFunLevelSystem.c)
        .setStyle('DANGER')
        .setCustomId('settingsFunClearLevelData')
    )
    if(data.leveling) {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsFunLevelSystem.l)
            .setStyle('SUCCESS')
            .setCustomId('settingsFunToggleLevelSystem')
        )
    } else {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsFunLevelSystem.l)
            .setStyle('DANGER')
            .setCustomId('settingsFunToggleLevelSystem')
        )
    }
    if(data.levelkick) {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsFunLevelSystem.cL)
            .setStyle('SUCCESS')
            .setCustomId('settingsFunToggleLevelKick')
        )
    } else {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsFunLevelSystem.cL)
            .setStyle('DANGER')
            .setCustomId('settingsFunToggleLevelKick')
        )
    }
    await interaction.update({ components: [buttons, buttons2, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};