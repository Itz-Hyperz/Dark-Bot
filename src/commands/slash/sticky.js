exports.run = async function(client, con, interaction, data, language) {

    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="sticky" OR guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
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
                .setCustomId('stickySelect')
                .setPlaceholder(language.sticky.selectAction)
                .addOptions([
                    {
                        label: language.sticky.add,
                        description: language.sticky.addDesc,
                        value: 'stickyAdd',
                    },
                    {
                        label: language.sticky.remove,
                        description: language.sticky.removeDesc,
                        value: 'stickyRemove',
                    }
                ]),
        );
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(language.sticky.embedTitle)
        .setDescription(language.sticky.embedDesc)
        .setTimestamp()
        await interaction.reply({ embeds: [embed], components: [menu, client.refreshButton], ephemeral: true }).catch(e => {});
    });

}

exports.info = {
    "name": "sticky",
    "description": "Add or Remove sticky messages."
}