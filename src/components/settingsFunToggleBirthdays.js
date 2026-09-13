module.exports = async function(client, con, interaction, data, language) {
    let gohome = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.home)
        .setStyle('SECONDARY')
        .setCustomId('settingsGoHome')
    )
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
        await con.query(`UPDATE guilds SET birthdays=false WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
            if(err) throw err;
        });
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.disabled)
            .setStyle('DANGER')
            .setCustomId('settingsFunToggleBirthdays')
        )
    } else {
        await con.query(`UPDATE guilds SET birthdays=true WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
            if(err) throw err;
        });
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.enabled)
            .setStyle('SUCCESS')
            .setCustomId('settingsFunToggleBirthdays')
        )
    }
    await interaction.update({ components: [buttons, buttons2, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};