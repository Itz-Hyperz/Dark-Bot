module.exports = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="applications" OR guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.noPermissions, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let granted = 0;
        await row.forEach(async (r) => {
            if(interaction.member.roles.cache.has(r.roleid)) {
                granted = 1;
            }
        });
        if(granted == 0) return interaction.reply({ content: language.missingPermissions, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let buttons = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(`${language.components.appAccept.button}: ${interaction.user.tag}`)
            .setStyle('SUCCESS')
            .setCustomId('disabledButton')
            .setDisabled(true)
        )
        let app = interaction.message.embeds[0].title
        let uniqueid = await interaction.message.embeds[0].footer.text
        let user = await client.users.fetch(interaction.message.embeds[0].author.name.split('(')[1].replaceAll(')', ''))
        await con.query(`SELECT * FROM applications WHERE guildid='${interaction.guild.id}' AND uniqueid='${uniqueid}'`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) return interaction.reply({ content: language.components.appAccept.err, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            let notice = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setTitle(language.components.appAccept.embedTitle)
            .setDescription(`${language.components.appAccept.app} ${app}\n${language.components.appAccept.message} ${row[0]?.acceptMessage}`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setFooter({ text: `${language.components.appAccept.button} ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            await user.send({ embeds: [notice] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            await interaction.update({ components: [buttons] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        });
    });
};