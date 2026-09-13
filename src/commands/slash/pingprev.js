exports.run = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="pingprev" OR guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.noPermissions, ephemeral: true }).catch(e => {});
        let granted = 0;
        await row.forEach(async (r) => {
            if(interaction.member.roles.cache.has(r.roleid)) {
                granted = 1;
            }
        });
        if(granted == 0) return interaction.reply({ content: language.missingPermissions, ephemeral: true }).catch(e => {});
        const menu = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageSelectMenu()
                .setCustomId('pingPreventionSelect')
                .setPlaceholder(language.pingPrevention.selectAction)
                .addOptions([
                    {
                        label: language.pingPrevention.addPingPrev,
                        description: language.pingPrevention.addPingPrevDesc,
                        value: 'pingPreventionAdd',
                    },
                    {
                        label: language.pingPrevention.removePingPrev,
                        description: language.pingPrevention.removePingPrevDesc,
                        value: 'pingPreventionRemove',
                    }
                ]),
        );
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(language.pingPrevention.embedTitle)
        .setDescription(language.pingPrevention.embedDesc)
        .setTimestamp()
        await interaction.reply({ embeds: [embed], components: [menu, client.refreshButton], ephemeral: true }).catch(e => {});
    });
};

exports.info = {
    "name": "pingprev",
    "description": "Manage your ping prevention status."
}