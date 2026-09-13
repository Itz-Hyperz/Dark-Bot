module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text);
    let controls = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('selfRolesDisabled2')
        .setStyle('SECONDARY')
        .setLabel(`${language.globalButtons.controls}`)
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('selfRolesManagerBack')
        .setStyle('PRIMARY')
        .setLabel(`${language.globalButtons.back}`)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('selfRolesManagerNext')
        .setStyle('PRIMARY')
        .setLabel(`${language.globalButtons.next}`)
    )
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('selfRolesDisabled')
        .setStyle('SECONDARY')
        .setLabel(`${language.globalButtons.options}`)
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('selfRolesManagerAdd')
        .setStyle('SUCCESS')
        .setLabel(`${language.components.selfRolesManager.addRole}`)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('selfRolesManagerDelete')
        .setStyle('DANGER')
        .setLabel(`${language.components.selfRolesManager.delete}`)
    )
    let gohome = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(`${language.globalButtons.home}`)
        .setStyle('SECONDARY')
        .setCustomId('selfRolesGoHome')
    )
    await con.query(`SELECT * FROM selfrolemenus WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.components.selfRolesManager.no, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let menuname = row[curr].menuname;
        let uniqueid = row[curr].uniqueid;
        await con.query(`SELECT * FROM selfroles WHERE guildid='${interaction.guild.id}' AND panelid='${uniqueid}'`, async (err, row) => {
            if(err) throw err;
            let embed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setAuthor({ name: uniqueid, iconURL: client.user.avatarURL({ dynamic: true }) })
            .setTitle(`${language.components.selfRolesManager.title}`)
            .setDescription(`${language.components.selfRolesManager.menuNae} \`${menuname || language.components.selfRolesManager.noMenus}\`\n\n${language.components.selfRolesManager.roleName} \`${row[0]?.rolename || language.components.selfRolesManager.noRoles}\`\n${language.components.selfRolesManager.roleId} \`${row[0]?.roleid || language.components.selfRolesManager.noRoles}\``)
            .setTimestamp()
            .setFooter({ text: `0` })
            await interaction.update({ embeds: [embed], components: [controls, buttons, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        });
    });
};