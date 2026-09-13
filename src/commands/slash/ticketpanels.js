exports.run = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="tickets" OR guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.noPermissions, ephemeral: true }).catch(e => {});
        let granted = 0;
        await row.forEach(async (r) => {
            if(interaction.member.roles.cache.has(r.roleid)) {
                granted = 1;
            }
        });
        if(granted == 0) return interaction.reply({ content: language.missingPermissions, ephemeral: true }).catch(e => {});
        let controls = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('ticketDisabled2')
            .setStyle('SECONDARY')
            .setLabel(language.globalButtons.controls)
            .setDisabled(true)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('ticketBack')
            .setStyle('PRIMARY')
            .setLabel(language.globalButtons.back)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('ticketNext')
            .setStyle('PRIMARY')
            .setLabel(language.globalButtons.next)
        )
        let buttons = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('ticketDisabled')
            .setStyle('SECONDARY')
            .setLabel(language.globalButtons.options)
            .setDisabled(true)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('ticketAdd')
            .setStyle('SUCCESS')
            .setLabel(language.ticketpanels.addPanel)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('ticketDelete')
            .setStyle('DANGER')
            .setLabel(language.globalButtons.deleteSelected)
        )
        let buttons2 = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('ticketDisabled5')
            .setStyle('SECONDARY')
            .setLabel(language.globalButtons.tools)
            .setDisabled(true)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('ticketPanelPost')
            .setStyle('PRIMARY')
            .setLabel(language.ticketpanels.post)
        )
        await con.query(`SELECT * FROM ticketcategories WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
            if(err) throw err;
            let embed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setTitle(language.ticketpanels.embedTitle)
            .setDescription(`${language.ticketpanels.panelName} ${row[0]?.catname || language.ticketpanels.noPanels}\n${language.ticketpanels.panelDesc} ${row[0]?.catdesc || 'N/A'}`)
            .setTimestamp()
            .setFooter({ text: '0' })
            await interaction.reply({ embeds: [embed], components: [controls, buttons, buttons2], ephemeral: true }).catch(e => {});
        });
    });
};

exports.info = {
    "name": "ticketpanels",
    "description": "Set up ticket panels for this guild."
}
