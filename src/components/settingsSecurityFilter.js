module.exports = async function(client, con, interaction, data, language, gohome) {
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsSecurityFilter.a)
        .setStyle('SECONDARY')
        .setCustomId('settingsSecurityToggleDisabled')
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsSecurityFilter.b)
        .setStyle('PRIMARY')
        .setCustomId('settingsSecurityFilterBack')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsSecurityFilter.c)
        .setStyle('PRIMARY')
        .setCustomId('settingsSecurityFilterNext')
    )
    let buttons2 = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsSecurityFilter.d)
        .setStyle('SECONDARY')
        .setCustomId('settingsSecurityToggleDisabled2')
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsSecurityFilter.e)
        .setStyle('SUCCESS')
        .setCustomId('settingsSecurityFilterAdd')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsSecurityFilter.f)
        .setStyle('DANGER')
        .setCustomId('settingsSecurityFilterDelete')
    )
    await con.query(`SELECT * FROM filtered WHERE guildid='${data.guildid}'`, async (err, row) => {
        if(err) throw err;
        let selection = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(language.components.settingsSecurityFilter.g)
        .setDescription(`${language.components.settingsSecurityFilter.h}\n\`\`\`\n${row[0]?.content || language.components.settingsSecurityFilter.i}\n\`\`\``)
        .setTimestamp()
        .setFooter({ text: '0' })
        await interaction.update({ embeds: [selection], components: [buttons, buttons2, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });

};