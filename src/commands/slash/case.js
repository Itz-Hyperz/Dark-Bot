exports.run = async function(client, con, interaction, data, language) {
    let caseid = interaction.options.getInteger('case_id')
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
        await con.query(`SELECT * FROM cases WHERE guildid='${interaction.guild.id}' AND caseid=${caseid}`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) return interaction.reply({ content: `${caseid} ${language.cases.doesNotExist}`, ephemeral: true }).catch(e => {});
            let embed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setTitle(language.cases.embedTitle)
            .addFields(
                { name: `${language.cases.caseId}:`, value: `${caseid}`, inline: true },
                { name: `${language.cases.caseType}:`, value: `\`${row[0].casetype}\``, inline: true },
                { name: `${language.logging.enforcer}:`, value: `<@${row[0].enforcerid}> (${row[0].enforcerid})`, inline: false },
                { name: `${language.cases.caseUser}:`, value: `<@${row[0].userid}> (${row[0].userid})`, inline: false },
                { name: `${language.logging.reason}:`, value: `${row[0].reason}`, inline: false },
                { name: `${language.logging.timestamp}:`, value: `${row[0].timedate}`, inline: false },
            )
            .setTimestamp()
            await interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => {});
        });
    });

}

exports.info = {
    "name": "case",
    "description": "View a cases information.",
    "options": [
      {
        "name": "case_id",
        "description": "The case Id to view.",
        "required": true,
        "type": "INTEGER"
      }
    ]
}