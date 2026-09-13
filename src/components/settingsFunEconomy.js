module.exports = async function(client, con, interaction, data, language, gohome) {
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
        .setLabel(language.components.settingsFunEconomy.clear)
        .setStyle('DANGER')
        .setCustomId('settingsFunEconomyClearData')
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

    await con.query(`SELECT * FROM shop WHERE guildid='${data.guildid}'`, async (err, row) => {
        if(err) throw err;
        let lol = row[0]
        let embed = new client.discord.MessageEmbed()
        .setColor(data.colorhex)
        .setTitle(language.components.settingsFunEconomy.economy)
        .setDescription(`${language.components.settingsFunEconomy.currency2} ${data.currency}\n\n${language.components.settingsFunEconomy.shop}\n${language.components.settingsFunEconomy.id} ${lol?.productId || language.components.settingsFunEconomy.no}\n${language.components.settingsFunEconomy.name} ${lol?.productName || language.components.settingsFunEconomy.no}\n${language.components.settingsFunEconomy.price} ${lol?.productPrice || language.components.settingsFunEconomy.no}`)
        .setTimestamp()
        .setFooter({ text: `0` })
        await interaction.update({ embeds: [embed], components: [buttons, buttons2, buttons3, buttons4, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};