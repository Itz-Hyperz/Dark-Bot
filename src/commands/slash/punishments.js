exports.run = async function(client, con, interaction, data, language) {
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.back)
        .setStyle("PRIMARY")
        .setCustomId('punishBack')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.next)
        .setStyle("PRIMARY")
        .setCustomId('punishNext')
    )
    let user = interaction.options.getUser('user')
    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="info" OR guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.noPermissions, ephemeral: true }).catch(e => {});
        let granted = 0;
        await row.forEach(async (r) => {
            if(interaction.member.roles.cache.has(r.roleid)) {
                granted = 1;
            }
        });
        if(granted == 0) return interaction.reply({ content: language.missingPermissions, ephemeral: true }).catch(e => {});
        await con.query(`SELECT * FROM cases WHERE guildid='${interaction.guild.id}' AND userid=${user.id}`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) return interaction.reply({ content: language.punishments.noHistory, ephemeral: true }).catch(e => {});
            let embed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setAuthor({ name: `${user.tag} (${user.id})`, iconURL: user.avatarURL({ dynamic: true }) })
            .setTitle(language.punishments.embedTitle)
            .addFields(
                { name: `${language.cases.caseId}:`, value: `${row[0].caseid}`, inline: true },
                { name: `${language.cases.caseType}:`, value: `\`${row[0].casetype}\``, inline: true },
                { name: `${language.logging.enforcer}:`, value: `<@${row[0].enforcerid}> (${row[0].enforcerid})`, inline: false },
                { name: `${language.cases.caseUser}:`, value: `<@${row[0].userid}> (${row[0].userid})`, inline: false },
                { name: `${language.logging.reason}:`, value: `${row[0].reason}`, inline: false },
                { name: `${language.logging.timestamp}:`, value: `${row[0].timedate}`, inline: false },
            )
            .setTimestamp()
            .setFooter({ text: `0` })
            await interaction.reply({ embeds: [embed], components: [buttons], ephemeral: true }).catch(e => {});
        });
    });

}

exports.info = {
    "name": "punishments",
    "description": "View a users case history.",
    "options": [
      {
        "name": "user",
        "description": "The user to view the case history of.",
        "required": true,
        "type": "USER"
      }
    ]
}