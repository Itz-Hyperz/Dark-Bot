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
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunEconomy.back)
        .setStyle('PRIMARY')
        .setCustomId('settingsFunEconomyBack')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunEconomy.next)
        .setStyle('PRIMARY')
        .setCustomId('settingsFunEconomyNext')
    )
    let buttons2 = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.options)
        .setStyle('SECONDARY')
        .setCustomId('settingsFunToggleDisabled2')
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunEconomy.add)
        .setStyle('SUCCESS')
        .setCustomId('settingsFunEconomyAdd')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.delete)
        .setStyle('DANGER')
        .setCustomId('settingsFunEconomyDelete')
    )
    let buttons3 = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.settings)
        .setStyle('SECONDARY')
        .setCustomId('settingsFunToggleDisabled3')
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunEconomy.currency)
        .setStyle('PRIMARY')
        .setCustomId('settingsFunEconomyCurrency')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunEconomy.cleared)
        .setStyle('DANGER')
        .setCustomId('settingsFunEconomyClearData')
        .setDisabled(true)
    )
    let buttons4 = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunEconomy.cooldowns)
        .setStyle('SECONDARY')
        .setCustomId('settingsFunToggleDisabled4')
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunEconomy.work)
        .setStyle('SECONDARY')
        .setCustomId('settingsFunEconomyWork')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunEconomy.crime)
        .setStyle('SECONDARY')
        .setCustomId('settingsFunEconomyCrime')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunEconomy.rob)
        .setStyle('SECONDARY')
        .setCustomId('settingsFunEconomyRob')
    )

    await con.query(`DELETE FROM shop WHERE guildid='${data.guildid}'`, async (err, row) => {
        if(err) throw err;
    });
    await con.query(`DELETE FROM owneditems WHERE guildid='${data.guildid}'`, async (err, row) => {
        if(err) throw err;
    });
    await con.query(`UPDATE economyusers SET workCooldown="false", crimeCooldown="false", robCooldown="false", balance=0, bank=0 WHERE guildid='${data.guildid}'`, async (err, row) => {
        if(err) throw err;
    });
    await con.query(`UPDATE guilds SET currency=":moneybag:" WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
    });

    await interaction.update({ components: [buttons, buttons2, buttons3, buttons4, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};