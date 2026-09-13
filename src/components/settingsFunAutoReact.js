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
        .setLabel(language.components.settingsFunAutoReact.back)
        .setStyle('PRIMARY')
        .setCustomId('settingsFunAutoreactBack')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsFunAutoReact.next)
        .setStyle('PRIMARY')
        .setCustomId('settingsFunAutoreactNext')
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
        .setLabel(language.components.settingsFunAutoReact.add)
        .setStyle('SUCCESS')
        .setCustomId('settingsFunAutoreactAdd')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.delete)
        .setStyle('DANGER')
        .setCustomId('settingsFunAutoreactDelete')
    )
    await con.query(`SELECT * FROM autoreact WHERE guildid='${data.guildid}'`, async (err, row) => {
        if(err) throw err;
        let selection = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(language.components.settingsFunAutoReact.title)
        .setDescription(`${language.components.settingsFunAutoReact.channel}\n<#${row[0]?.channelid || language.components.settingsFunAutoReact.no}>\n\n${language.components.settingsFunAutoReact.response}\n${row[0]?.emoji || language.components.settingsFunAutoReact.emoji}`)
        .setTimestamp()
        .setFooter({ text: '0' })
        await interaction.update({ embeds: [selection], components: [buttons, buttons2, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });

};