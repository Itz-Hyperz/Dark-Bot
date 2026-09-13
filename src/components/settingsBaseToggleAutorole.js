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
        .setLabel(language.globalButtons.controls)
        .setStyle('SECONDARY')
        .setCustomId('settingsBaseToggleDisabled')
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsBaseToggleAutorole.back)
        .setStyle('PRIMARY')
        .setCustomId('settingsBaseAutoroleBack')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsBaseToggleAutorole.next)
        .setStyle('PRIMARY')
        .setCustomId('settingsBaseAutoroleNext')
    )
    let buttons2 = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.toggle)
        .setStyle('SECONDARY')
        .setCustomId('settingsBaseToggleDisabled2')
        .setDisabled(true)
    )
    if(data.autorole) {
        await con.query(`UPDATE guilds SET autorole=false WHERE guildid="${data.guildid}"`, async (err, row) => {
            if(err) throw err;
        });
        buttons2.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.disabled)
            .setStyle('DANGER')
            .setCustomId('settingsBaseToggleAutorole')
        )
    } else {
        await con.query(`UPDATE guilds SET autorole=true WHERE guildid="${data.guildid}"`, async (err, row) => {
            if(err) throw err;
        });
        buttons2.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.enabled)
            .setStyle('SUCCESS')
            .setCustomId('settingsBaseToggleAutorole')
        )
    }
    let buttons3 = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.options)
        .setStyle('SECONDARY')
        .setCustomId('settingsBaseControlsDisabled')
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsBaseToggleAutorole.add)
        .setStyle('SUCCESS')
        .setCustomId('settingsBaseAutoroleAdd')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsBaseToggleAutorole.remove)
        .setStyle('DANGER')
        .setCustomId('settingsBaseAutoroleDelete')
    )
    await interaction.update({ components: [buttons, buttons2, buttons3, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};