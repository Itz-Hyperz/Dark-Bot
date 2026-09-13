module.exports = async function(client, con, interaction, data, language) {
    let gohome = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunToggleLevelSystem.a)
        .setStyle('SECONDARY')
        .setCustomId('settingsGoHome')
    )
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunToggleLevelSystem.b)
        .setStyle('SECONDARY')
        .setCustomId('settingsSecurityToggleDisabled')
        .setDisabled(true)
    )
    let buttons2 = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunToggleLevelSystem.c)
        .setStyle('SECONDARY')
        .setCustomId('settingsFunToggleDisabled2')
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunToggleLevelSystem.d)
        .setStyle('DANGER')
        .setCustomId('settingsFunClearLevelData')
    )
    if(data.leveling) {
        await con.query(`UPDATE guilds SET leveling=false WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
            if(err) throw err;
        });
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsFunToggleLevelSystem.e)
            .setStyle('DANGER')
            .setCustomId('settingsFunToggleLevelSystem')
        )
    } else {
        await con.query(`UPDATE guilds SET leveling=true WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
            if(err) throw err;
        });
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsFunToggleLevelSystem.e)
            .setStyle('SUCCESS')
            .setCustomId('settingsFunToggleLevelSystem')
        )
    }
    if(data.levelkick) {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsFunToggleLevelSystem.f)
            .setStyle('SUCCESS')
            .setCustomId('settingsFunToggleLevelKick')
        )
    } else {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsFunToggleLevelSystem.f)
            .setStyle('DANGER')
            .setCustomId('settingsFunToggleLevelKick')
        )
    }
    await interaction.update({ components: [buttons, buttons2, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};