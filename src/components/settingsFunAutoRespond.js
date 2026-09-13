module.exports = async function(client, con, interaction, data, language, gohome) {
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.controls)
        .setStyle('SECONDARY')
        .setCustomId('settingsFunToggleDisabled')
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunAutoRespond.back)
        .setStyle('PRIMARY')
        .setCustomId('settingsFunAutorespondBack')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunAutoRespond.next)
        .setStyle('PRIMARY')
        .setCustomId('settingsFunAutorespondNext')
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
        .setLabel(language.components.settingsFunAutoRespond.add)
        .setStyle('SUCCESS')
        .setCustomId('settingsFunAutorespondAdd')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.delete)
        .setStyle('DANGER')
        .setCustomId('settingsFunAutorespondDelete')
    )
    await con.query(`SELECT * FROM autorespond WHERE guildid='${data.guildid}'`, async (err, row) => {
        if(err) throw err;
        let selection = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(language.components.settingsFunAutoRespond.title)
        .setDescription(`${language.components.settingsFunAutoRespond.detect}\n\`\`\`\n${row[0]?.detect || language.components.settingsFunAutoRespond.no}\n\`\`\`\n${language.components.settingsFunAutoRespond.response}\n\`\`\`\n${row[0]?.response || language.components.settingsFunAutoRespond.none}\n\`\`\``)
        .setTimestamp()
        .setFooter({ text: '0' })
        await interaction.update({ embeds: [selection], components: [buttons, buttons2, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });

};