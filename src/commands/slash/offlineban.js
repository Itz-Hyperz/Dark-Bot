exports.run = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="mod" OR guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.noPermissions, ephemeral: true }).catch(e => {});
        let granted = 0;
        await row.forEach(async (r) => {
            if(interaction.member.roles.cache.has(r.roleid)) {
                granted = 1;
            }
        });
        if(granted == 0) return interaction.reply({ content: language.missingPermissions, ephemeral: true }).catch(e => {});
        let userid = await interaction.options.getString('user_id')
        let reason = await interaction.options.getString('reason')
        userid = userid.replaceAll('"', '')
        userid = userid.replaceAll('`', '')
        reason = reason.replaceAll('"', '')
        reason = reason.replaceAll('`', '')
        await con.query(`INSERT INTO offlinebans (guildid, userid, reason, enforcerid) VALUES ("${interaction.guild.id}", "${userid}", "${reason}", "${interaction.user.id}")`, async (err, row) => {
            if(err) throw err;
            await interaction.reply({ content: `${language.offlineBan.success} <@${userid}>!`, ephemeral: true }).catch(e => {});
        });
        let logembed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setAuthor({ name: `${language.logging.actionLogs} - ${language.logging.types.userOfflineBanned}`, iconURL: client.user.avatarURL({ dynamic: true }) })
        .addFields(
            {name: `${language.logging.enforcer}:`, value: `${interaction.user.tag}`},
            {name: `${language.logging.userId}:`, value: `${userid}`},
            {name: `${language.logging.reason}:`, value: `${reason}`},
        )
        .setTimestamp()
        await client.utils.makeCase(client, con, data, userid, interaction.user.id, language.logging.types.userOfflineBanned, reason, logembed)
        await interaction.reply({ content: `**${language.logging.types.userOfflineBanned}!**`, ephemeral: true }).catch(e => {});
    });
};

exports.info = {
    "name": "offlineban",
    "description": "Ban someone who isn't in the guild.",
    "options": [
      {
        "name": "user_id",
        "description": "The user id of the user to ban.",
        "required": true,
        "type": "STRING"
    },
      {
        "name": "reason",
        "description": "The reason to ban the user.",
        "required": true,
        "type": "STRING"
      }
    ]
}