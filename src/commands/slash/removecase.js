exports.run = async function(client, con, interaction, data, language) {
    let caseid = interaction.options.getInteger('case_id')
    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
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
            await con.query(`DELETE FROM cases WHERE guildid='${interaction.guild.id}' AND caseid=${caseid}`, async (err, row) => {
                if(err) throw err;
            });
            let logembed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setAuthor({ name: `${language.logging.actionLogs} - ${language.logging.types.caseDeleted}`, iconURL: client.user.avatarURL({ dynamic: true }) })
            .addFields(
                { name: `${language.cases.caseId}:`, value: `${caseid}`, inline: false },
                { name: `${language.logging.enforcer}:`, value: `\`${interaction.user.tag}\``, inline: false }
            )
            .setTimestamp()
            await client.utils.sendLog(client, con, data, 'modlogs', logembed);
            await interaction.reply({ content: `**${language.logging.types.caseDeleted}!**`, ephemeral: true }).catch(e => {});
        });
    });

}

exports.info = {
    "name": "removecase",
    "description": "Remove a case from the database.",
    "options": [
      {
        "name": "case_id",
        "description": "The case Id to remove.",
        "required": true,
        "type": "INTEGER"
      }
    ]
}