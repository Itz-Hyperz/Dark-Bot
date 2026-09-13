exports.run = async function(client, con, interaction, data, language) {
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
        
        let daGuild = interaction.guild;
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(`${language.server.serverInfo}: ${daGuild.name}`)
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({dynamic: true}) })
        .setThumbnail(daGuild.iconURL({ dynamic: true }))
        .addFields(
            { name: `${language.server.name}:`, value: `${daGuild.name}`, inline: true},
            { name: `${language.server.id}:`, value: `${daGuild.id}\n`, inline: true},
            { name: `${language.server.owner}:`, value: `<@${daGuild.ownerId}>\n`, inline: true},
            { name: `${language.server.members}:`, value: `${daGuild.members.cache.size}`, inline: true},
            { name: `${language.server.users}:`, value: `${daGuild.members.cache.filter(member => !member.user.bot).size}`, inline: true},
            { name: `${language.server.bots}:`, value: `${daGuild.members.cache.filter(member => member.user.bot).size}`, inline: true},
            { name: `${language.server.date}:`, value: `\`\`\`${daGuild.createdAt.toLocaleString()}\`\`\``},
        )
        .setTimestamp()
        .setFooter({ text: `${language.server.requestedBy} ${interaction.user.tag}` })
        await interaction.reply({ embeds: [embed], ephemeral: client.config.commands.ephemeral }).catch(e => {});
    });
};

exports.info = {
    "name": "server",
    "description": "View this servers information."
}