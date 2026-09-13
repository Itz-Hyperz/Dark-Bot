module.exports = async function(client, con, interaction, data, language, gohome) {
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(`${language.globalButtons.controls}`)
        .setStyle('SECONDARY')
        .setCustomId('settingsBaseToggleDisabled')
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(`${language.components.settingsBaseAutorole.backRole}`)
        .setStyle('PRIMARY')
        .setCustomId('settingsBaseAutoroleBack')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(`${language.components.settingsBaseAutorole.nextRole}`)
        .setStyle('PRIMARY')
        .setCustomId('settingsBaseAutoroleNext')
    )
    let buttons2 = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(`${language.components.settingsBaseAutorole.toggle}`)
        .setStyle('SECONDARY')
        .setCustomId('settingsBaseToggleDisabled2')
        .setDisabled(true)
    )
    if(data.autorole) {
        buttons2.addComponents(
            new client.discord.MessageButton()
            .setLabel(`${language.components.settingsBaseAutorole.enable}`)
            .setStyle('SUCCESS')
            .setCustomId('settingsBaseToggleAutorole')
        )
    } else {
        buttons2.addComponents(
            new client.discord.MessageButton()
            .setLabel(`${language.components.settingsBaseAutorole.disable}`)
            .setStyle('DANGER')
            .setCustomId('settingsBaseToggleAutorole')
        )
    }
    let buttons3 = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(`${language.globalButtons.options}`)
        .setStyle('SECONDARY')
        .setCustomId('settingsBaseControlsDisabled')
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(`${language.components.settingsBaseAutorole.addRole}`)
        .setStyle('SUCCESS')
        .setCustomId('settingsBaseAutoroleAdd')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(`${language.components.settingsBaseAutorole.removeRole}`)
        .setStyle('DANGER')
        .setCustomId('settingsBaseAutoroleDelete')
    )
    await con.query(`SELECT * FROM autoroles WHERE guildid='${data.guildid}'`, async (err, row) => {
        if(err) throw err;
        let check;
        if(row[0]?.verify) {
            check = 'true';
        } else if(!row[0]?.verify) {
            check = 'false';
        } else {
            check = language.components.settingsBaseAutorole.no;
        };
        let selection = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(`${language.components.settingsBaseAutorole.title}`)
        .setDescription(`${language.components.settingsBaseAutorole.role}\n<@&${row[0]?.roleid || language.components.settingsBaseAutorole.no}>\n\n${language.components.settingsBaseAutorole.verification}\n${check}`)
        .setTimestamp()
        .setFooter({ text: '0' })
        await interaction.update({ embeds: [selection], components: [buttons, buttons2, buttons3, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });

};