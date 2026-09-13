module.exports = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM tickets WHERE guildid='${interaction.guild.id}' AND channelid='${interaction.channel.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: `${language.components.ticketClaim.a}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let buttons = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(`${language.components.ticketClaim.b}`)
            .setStyle('DANGER')
            .setCustomId('ticketClose')
        )
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(`${language.components.ticketClaim.c}`)
            .setStyle('SUCCESS')
            .setCustomId('ticketRename')
        )
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(`${language.components.ticketClaim.d}`)
            .setStyle('PRIMARY')
            .setCustomId('ticketAddUser')
        )
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(`${language.components.ticketClaim.e}`)
            .setStyle('PRIMARY')
            .setCustomId('ticketRemoveUser')
        )
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(`${language.components.ticketClaim.f} ${interaction.user.username}`)
            .setStyle('SECONDARY')
            .setCustomId('ticketClaim')
            .setDisabled(true)
        )
        await con.query(`UPDATE tickets SET claimedby='${interaction.user.id}' WHERE guildid='${interaction.guild.id}' AND channelid='${interaction.channel.id}' LIMIT 1`, async (err, row) => {
            if(err) throw err;
        });
        await interaction.update({ components: [buttons], ephemeral: false }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        console.log(`${interaction.channel.topic} | ${language.components.ticketClaim.g} ${interaction.user.username}`)
        await interaction.channel.setTopic(`${interaction.channel.topic} | ${language.components.ticketClaim.g} ${interaction.user.username}`).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};