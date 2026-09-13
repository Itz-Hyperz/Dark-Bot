exports.run = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="applications" OR guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.noPermissions, ephemeral: true }).catch(e => {});
        let granted = 0;
        await row.forEach(async (r) => {
            if(interaction.member.roles.cache.has(r.roleid)) {
                granted = 1;
            }
        });
        if(granted == 0) return interaction.reply({ content: language.missingPermissions, ephemeral: true }).catch(e => {});
        let buttons1 = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.controls)
            .setStyle('SECONDARY')
            .setCustomId('appControlsDisabled1')
            .setDisabled(true)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.back)
            .setStyle('PRIMARY')
            .setCustomId('appMenuBack')
        )
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.next)
            .setStyle('PRIMARY')
            .setCustomId('appMenuNext')
        )
        let buttons2 = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.options)
            .setStyle('SECONDARY')
            .setCustomId('appControlsDisabled2')
            .setDisabled(true)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(language.applicationMenu.questions)
            .setStyle('SECONDARY')
            .setCustomId('appMenuQuestions')
        )
        let buttons3 = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.settings)
            .setStyle('SECONDARY')
            .setCustomId('appControlsDisabled3')
            .setDisabled(true)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(language.applicationMenu.createForm)
            .setStyle('SUCCESS')
            .setCustomId('appMenuAdd')
        )
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.deleteSelected)
            .setStyle('DANGER')
            .setCustomId('appMenuDelete')
        )
        await con.query(`SELECT * FROM applications WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
            if(err) throw err;
            if(row[0]?.closed) {
                buttons2.addComponents(
                    new client.discord.MessageButton()
                    .setLabel(language.globalButtons.closed)
                    .setStyle('DANGER')
                    .setCustomId('appMenuToggleClosed')
                )
            } else {
                buttons2.addComponents(
                    new client.discord.MessageButton()
                    .setLabel(language.globalButtons.open)
                    .setStyle('SUCCESS')
                    .setCustomId('appMenuToggleClosed')
                )
            };
            let embed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setTitle(language.applicationMenu.embedTitle)
            .setDescription(`${language.applicationMenu.embedName}${row[0]?.appname || language.applicationMenu.noAppsYet}`)
            .setTimestamp()
            .setFooter({ text: '0' })
            await interaction.reply({ embeds: [embed], components: [buttons1, buttons2, buttons3], ephemeral: true }).catch(e => {
                console.log(e)
            }); 
        });
    });
};

exports.info = {
    "name": "applicationmenu",
    "description": "Manage this guilds applications."
}