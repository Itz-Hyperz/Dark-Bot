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
        let member = interaction.guild.members.cache.get(user.id)
        let time = await interaction.options.getString('time')
        let reason = await interaction.options.getString('reason')
        reason = reason.replaceAll('"', '')
        reason = reason.replaceAll('`', '')
        let logembed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setAuthor({ name: `${language.logging.actionLogs} - ${language.logging.types.userMuted}`, iconURL: client.user.avatarURL({ dynamic: true }) })
        .addFields(
            {name: `${language.logging.enforcer}:`, value: `${interaction.user.tag}`},
            {name: `${language.logging.userId}:`, value: `${user.id}`},
            {name: `${language.logging.userTag}:`, value: `${user.tag}`},
            {name: `${language.logging.reason}:`, value: `${reason}`},
            {name: `${language.logging.time}:`, value: `${time}`}
        )
        .setTimestamp()
        await client.utils.makeCase(client, con, data, user.id, interaction.user.id, `${language.logging.types.userMuted}`, reason, logembed)
        await interaction.reply({ content: `**${language.logging.types.userMuted}!**`, ephemeral: true }).catch(e => {});
        await user.send({ embeds: [logembed] }).then(async (msg) => {
            if(member.roles.cache.has(data.muterole)) {
                return interaction.editReply({ content: language.mute.already }).catch(e => {});
            };
            await member.roles.add(data.muterole).catch(e => {});
            setTimeout(async () => {
                if(!member.roles.cache.has(data.muterole)) return;
                await member.roles.remove(data.muterole).catch(e => {});
                let logembed = new client.discord.MessageEmbed()
                .setColor(data.themecolor || '#FFFFFF')
                .setAuthor({ name: `${language.logging.actionLogs} - ${language.logging.types.autoUnmute}`, iconURL: client.user.avatarURL({ dynamic: true }) })
                .addFields(
                    {name: `${language.logging.userId}:`, value: `${user.id}`},
                    {name: `${language.logging.userTag}:`, value: `${user.tag}`}
                )
                .setTimestamp()
                await client.utils.makeCase(client, con, data, user.id, interaction.user.id, `${language.logging.types.autoUnmute}`, 'NA', logembed)
            }, ms(time))
        }).catch(async e => {
            if(member.roles.cache.has(data.muterole)) {
                return interaction.editReply({ content: language.mute.already }).catch(e => {});
            };
            await interaction.guild.members.cache.get(user.id).roles.add(data.muterole).catch(e => {});
            setTimeout(async () => {
                if(!member.roles.cache.has(data.muterole)) return;
                await member.roles.remove(data.muterole).catch(e => {});
                let logembed = new client.discord.MessageEmbed()
                .setColor(data.themecolor || '#FFFFFF')
                .setAuthor({ name: `${language.logging.actionLogs} - ${language.logging.types.autoUnmute}`, iconURL: client.user.avatarURL({ dynamic: true }) })
                .addFields(
                    {name: `${language.logging.userId}:`, value: `${user.id}`},
                    {name: `${language.logging.userTag}:`, value: `${user.tag}`}
                )
                .setTimestamp()
                await client.utils.makeCase(client, con, data, user.id, interaction.user.id, `${language.logging.types.autoUnmute}`, 'NA', logembed)
            }, ms(time))
        });
    });
};

exports.info = {
    "name": "mute",
    "description": "Mute someone in the guild.",
    "options": [
      {
        "name": "user",
        "description": "The user to mute from this guild.",
        "required": true,
        "type": "USER"
    },
      {
        "name": "time",
        "description": "How long you wish to mute them for. (Ex: 15m = 15 minutes)",
        "required": true,
        "type": "STRING"
    },
      {
        "name": "reason",
        "description": "The reason for muting the user.",
        "required": true,
        "type": "STRING"
      }
    ]
}