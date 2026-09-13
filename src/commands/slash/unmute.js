const ms = require('ms');
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
        let logembed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setAuthor({ name: `${language.logging.actionLogs} - ${language.logging.types.userUnmuted}`, iconURL: client.user.avatarURL({ dynamic: true }) })
        .addFields(
            {name: `${language.logging.enforcer}:`, value: `${interaction.user.tag}`},
            {name: `${language.logging.userId}:`, value: `${user.id}`},
            {name: `${language.logging.userTag}:`, value: `${user.tag}`}
        )
        .setTimestamp()
        await client.utils.makeCase(client, con, data, user.id, interaction.user.id, `${language.logging.types.userUnmuted}`, 'NA', logembed)
        await interaction.reply({ content: `**${language.logging.types.userUnmuted}!**`, ephemeral: true }).catch(e => {});
        await user.send({ embeds: [logembed] }).then(async (msg) => {
            if(!interaction.guild.members.cache.get(user.id).roles.cache.has(data.muterole)) {
                return interaction.editReply({ content: language.mute.not }).catch(e => {});
            };
            await interaction.guild.members.cache.get(user.id).roles.remove(data.muterole).catch(e => {});
        }).catch(async e => {
            if(!interaction.guild.members.cache.get(user.id).roles.cache.has(data.muterole)) {
                return interaction.editReply({ content: language.mute.not }).catch(e => {});
            };
            await interaction.guild.members.cache.get(user.id).roles.remove(data.muterole).catch(e => {});
        });
    });
};

exports.info = {
    "name": "unmute",
    "description": "Unmute someone in the guild.",
    "options": [
      {
        "name": "user",
        "description": "The user to unmute from this guild.",
        "required": true,
        "type": "USER"
      }
    ]
}