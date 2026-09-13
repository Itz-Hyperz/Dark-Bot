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
        let user = await interaction.options.getUser('user')
        let reason = await interaction.options.getString('reason')
        reason = reason.replaceAll('"', '')
        reason = reason.replaceAll('`', '')
        let logembed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setAuthor({ name: `${language.logging.actionLogs} - ${language.logging.types.userKicked}`, iconURL: client.user.avatarURL({ dynamic: true }) })
        .addFields(
            {name: `${language.logging.enforcer}:`, value: `${interaction.user.tag}`},
            {name: `${language.logging.userId}:`, value: `${user.id}`},
            {name: `${language.logging.userTag}:`, value: `${user.tag}`},
            {name: `${language.logging.reason}:`, value: `${reason}`},
        )
        .setTimestamp()
        await client.utils.makeCase(client, con, data, user.id, interaction.user.id, language.logging.types.userKicked, reason, logembed)
        await user.send({ embeds: [logembed] }).then(async (msg) => {
            await interaction.guild.members.cache.get(user.id).kick().catch(e => {});
        }).catch(async e => {
            await interaction.guild.members.cache.get(user.id).kick().catch(e => {});
        });
        await interaction.reply({ content: `**${language.logging.types.userKicked}!**`, ephemeral: true }).catch(e => {});
    });
};

exports.info = {
    "name": "kick",
    "description": "Kick someone from this guild.",
    "options": [
      {
        "name": "user",
        "description": "The user to kick from this guild.",
        "required": true,
        "type": "USER"
    },
      {
        "name": "reason",
        "description": "The reason for kicking the user.",
        "required": true,
        "type": "STRING"
      }
    ]
}