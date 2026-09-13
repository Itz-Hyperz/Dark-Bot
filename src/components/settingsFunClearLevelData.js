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
        .setLabel(language.components.settingsFunClearLevelData.cleared)
        .setStyle('DANGER')
        .setCustomId('settingsFunClearLevelData')
        .setDisabled(true)
    )
    if(data.leveling) {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsFunClearLevelData.level)
            .setStyle('SUCCESS')
            .setCustomId('settingsFunToggleLevelSystem')
        )
    } else {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsFunClearLevelData.level)
            .setStyle('DANGER')
            .setCustomId('settingsFunToggleLevelSystem')
        )
    }
    if(data.levelkick) {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsFunClearLevelData.clear)
            .setStyle('SUCCESS')
            .setCustomId('settingsFunToggleLevelKick')
        )
    } else {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsFunClearLevelData.clear)
            .setStyle('DANGER')
            .setCustomId('settingsFunToggleLevelKick')
        )
    }
    await con.query(`UPDATE chatlvl SET userxp=0, userlvl=0 WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
    });
    await interaction.update({ components: [buttons, buttons2, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};