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
        let count = await interaction.options.getInteger('amount')
        let fetched = await interaction.channel.messages.fetch({
            limit: count,
        });
        await interaction.channel.bulkDelete(fetched).then(() => {
            interaction.reply({ content: `**${count} ${language.purge.msgDeleted}**`, ephemeral: true }).catch(e => {});
        }).catch(e => {
            interaction.reply({ content: `${language.purge.error}\n${language.purge.reason}`, ephemeral: true }).catch(e => {});
        });
    });
};

exports.info = {
    "name": "purge",
    "description": "Bulk delete messages in a channel.",
    "options": [
      {
        "name": "amount",
        "description": "The # of messages to purge.",
        "required": true,
        "type": "INTEGER"
      }
    ]
}