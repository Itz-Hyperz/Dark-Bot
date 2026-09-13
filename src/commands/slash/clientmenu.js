exports.run = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="clients" OR guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.noPermissions, ephemeral: true }).catch(e => {});
        let granted = 0;
        await row.forEach(async (r) => {
            if(interaction.member.roles.cache.has(r.roleid)) {
                granted = 1;
            }
        });
        if(granted == 0) return interaction.reply({ content: language.missingPermissions, ephemeral: true }).catch(e => {});
        let base = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageSelectMenu()
                .setCustomId('clientSelect')
                .setPlaceholder(language.clients.selectAction)
                .addOptions([
                    {
                        label: language.clients.addClient,
                        description: language.clients.addClientDescription,
                        value: 'clientAdd',
                    },
                    {
                        label: language.clients.removeClient,
                        description: language.clients.removeClientDescription,
                        value: 'clientRemove',
                    }
                ]),
        );
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(language.clients.embedTitle)
        .setDescription(language.clients.embedDescription)
        .setTimestamp()
        await interaction.reply({ embeds: [embed], components: [base, client.refreshButton], ephemeral: true }).catch(e => {});
    });
};

exports.info = {
    "name": "clientmenu",
    "description": "Manage this guilds clients."
}