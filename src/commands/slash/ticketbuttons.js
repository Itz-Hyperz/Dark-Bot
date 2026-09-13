exports.run = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="tickets" OR guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.noPermissions, ephemeral: true }).catch(e => {});
        let granted = 0;
        await row.forEach(async (r) => {
            if(interaction.member.roles.cache.has(r.roleid)) {
                granted = 1;
            }
        });
        if(granted == 0) return interaction.reply({ content: language.missingPermissions, ephemeral: true }).catch(e => {});
        let buttons = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(language.ticketbuttons.close)
            .setStyle('DANGER')
            .setCustomId('ticketClose')
        )
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(language.ticketbuttons.rename)
            .setStyle('SUCCESS')
            .setCustomId('ticketRename')
        )
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(language.ticketbuttons.add)
            .setStyle('PRIMARY')
            .setCustomId('ticketAddUser')
        )
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(language.ticketbuttons.remove)
            .setStyle('PRIMARY')
            .setCustomId('ticketRemoveUser')
        )
        await con.query(`SELECT * FROM tickets WHERE guildid='${interaction.guild.id}' AND channelid='${interaction.channel.id}'`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) return interaction.reply({ content: language.ticketbuttons.onlyInTicket, ephemeral: true }).catch(e => {});
            if(row[0].claimedby == 'NA') {
                buttons.addComponents(
                    new client.discord.MessageButton()
                    .setLabel(language.ticketbuttons.claim)
                    .setStyle('SECONDARY')
                    .setCustomId('ticketClaim')
                )
            } else {
                let bro = await client.users.fetch(row[0].claimedby);
                buttons.addComponents(
                    new client.discord.MessageButton()
                    .setLabel(`${language.ticketbuttons.claimedBy} ${bro.username}`)
                    .setStyle('SECONDARY')
                    .setCustomId('ticketClaim')
                    .setDisabled(true)
                )
            }
            await interaction.reply({ content: language.ticketbuttons.message, components: [buttons], ephemeral: false }).catch(e => {});
        });
    });
};

exports.info = {
    "name": "ticketbuttons",
    "description": "View useful ticket buttons."
}