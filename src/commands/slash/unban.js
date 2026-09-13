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
        let user = await interaction.options.getString('user')
        user = await client.users.fetch(user);
        let logembed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setAuthor({ name: `${language.logging.actionLogs} - ${language.logging.types.userUnbanned}`, iconURL: client.user.avatarURL({ dynamic: true }) })
        .addFields(
            {name: `${language.logging.enforcer}:`, value: `${interaction.user.tag}`},
            {name: `${language.logging.userId}:`, value: `${user.id}`},
            {name: `${language.logging.userTag}:`, value: `${user.tag}`}
        )
        .setTimestamp()
        await client.utils.makeCase(client, con, data, user.id, interaction.user.id, `${language.logging.types.userUnbanned}`, 'NA', logembed)
        await interaction.guild.members.unban(user.id).catch(e => {});
        await con.query(`DELETE FROM offlinebans WHERE guildid="${interaction.guild.id}" AND userid="${user.id}"`, async (err, row) => {
            if(err) throw err;
        });
        await interaction.reply({ content: `**${language.logging.types.userUnbanned}!**`, ephemeral: true }).catch(e => {});
    });
};

exports.info = {
    "name": "unban",
    "description": "Unban someone from this guild.",
    "options": [
      {
        "name": "user",
        "description": "The user Id to unban from this guild.",
        "required": true,
        "type": "STRING"
      }
    ]
}