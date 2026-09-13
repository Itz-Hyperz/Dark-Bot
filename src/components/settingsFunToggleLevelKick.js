module.exports = async function(client, con, interaction, data, language) {
    let gohome = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunToggleLevelKick.a)
        .setStyle('SECONDARY')
        .setCustomId('settingsGoHome')
    )
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunToggleLevelKick.b)
        .setStyle('SECONDARY')
        .setCustomId('settingsSecurityToggleDisabled')
        .setDisabled(true)
    )
    let buttons2 = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunToggleLevelKick.c)
        .setStyle('SECONDARY')
        .setCustomId('settingsFunToggleDisabled2')
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunToggleLevelKick.d)
        .setStyle('DANGER')
        .setCustomId('settingsFunClearLevelData')
    )
    if(data.leveling) {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsFunToggleLevelKick.e)
            .setStyle('SUCCESS')
            .setCustomId('settingsFunToggleLevelSystem')
        )
    } else {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsFunToggleLevelKick.e)
            .setStyle('DANGER')
            .setCustomId('settingsFunToggleLevelSystem')
        )
    }
    if(data.levelkick) {
        await con.query(`UPDATE guilds SET levelkick=false WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
            if(err) throw err;
        });
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsFunToggleLevelKick.f)
            .setStyle('DANGER')
            .setCustomId('settingsFunToggleLevelKick')
        )
    } else {
        await con.query(`UPDATE guilds SET levelkick=true WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
            if(err) throw err;
        });
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsFunToggleLevelKick.f)
            .setStyle('SUCCESS')
            .setCustomId('settingsFunToggleLevelKick')
        )
    }
    await interaction.update({ components: [buttons, buttons2, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};