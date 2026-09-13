module.exports = async function(client, con, interaction, data, language) {
    let channelid = interaction.message.embeds[0].footer.text
    con.query(`SELECT * FROM privatecalls WHERE uniqueid="${channelid}"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.vcNoChannel }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let channel = await client.channels.cache.get(channelid);
        await channel.delete().catch(e => { if(client?.config?.debugmode) console.log(e) });
        con.query(`DELETE FROM privatecalls WHERE uniqueid="${channelid}"`, function(err, row) {
            if(err) throw err;
        });
    });
    let buttonsupdated = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsBaseGeneralSettings.options)
        .setStyle('SECONDARY')
        .setCustomId('settingsBaseDisabled1')
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.vcAddMember)
        .setStyle('SUCCESS')
        .setCustomId('privateVoiceAddMember')
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.vcRemoveMember)
        .setStyle('DANGER')
        .setCustomId('privateVoiceRemoveMember')
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.closed)
        .setStyle('SECONDARY')
        .setCustomId('privateVoiceClose')
        .setDisabled(true)
    )
    interaction.update({ components: [buttonsupdated] }).catch(e => { if(client?.config?.debugmode) console.log(e) })
}