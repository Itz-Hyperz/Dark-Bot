exports.run = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="selfroles" OR guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
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
            .setCustomId('selfRolesDisabled2')
            .setStyle('SECONDARY')
            .setLabel(language.globalButtons.controls)
            .setDisabled(true)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('selfRolesBack')
            .setStyle('PRIMARY')
            .setLabel(language.globalButtons.back)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('selfRolesNext')
            .setStyle('PRIMARY')
            .setLabel(language.globalButtons.next)
        )
        let buttons = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('selfRolesDisabled')
            .setStyle('SECONDARY')
            .setLabel(language.globalButtons.options)
            .setDisabled(true)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('selfRolesAdd')
            .setStyle('SUCCESS')
            .setLabel(language.selfroles.addMenu)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('selfRolesDelete')
            .setStyle('DANGER')
            .setLabel(language.globalButtons.deleteSelected)
        )
        let buttons2 = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('selfRolesDisabled3')
            .setStyle('SECONDARY')
            .setLabel(language.globalButtons.settings)
            .setDisabled(true)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('selfRolesManager')
            .setStyle('SECONDARY')
            .setLabel(language.selfroles.roleManager)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('selfRolesPost')
            .setStyle('PRIMARY')
            .setLabel(language.selfroles.postPanel)
        )
        await con.query(`SELECT * FROM selfrolemenus WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
            if(err) throw err;
            let embed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setTitle(language.selfroles.embedTitle)
            .setDescription(`${language.selfroles.menuName} \`${row[0]?.menuname || language.selfroles.noMenus}\``)
            .setTimestamp()
            .setFooter({ text: '0' })
            await interaction.reply({ embeds: [embed], components: [controls, buttons, buttons2], ephemeral: true }).catch(e => {});
        });
    });
};

exports.info = {
    "name": "selfroles",
    "description": "Set up self-roles for this guild."
}