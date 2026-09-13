module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text);
    let buttons1 = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.controls)
        .setStyle('SECONDARY')
        .setCustomId('appControlsDisabled1')
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.back)
        .setStyle('PRIMARY')
        .setCustomId('appMenuBack')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.next)
        .setStyle('PRIMARY')
        .setCustomId('appMenuNext')
    )
    let buttons2 = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.options)
        .setStyle('SECONDARY')
        .setCustomId('appControlsDisabled2')
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.appMenuGoHome.questions)
        .setStyle('SECONDARY')
        .setCustomId('appMenuQuestions')
    )
    let buttons3 = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.settings)
        .setStyle('SECONDARY')
        .setCustomId('appControlsDisabled3')
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.appMenuGoHome.createform)
        .setStyle('SUCCESS')
        .setCustomId('appMenuAdd')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.deleteSelected)
        .setStyle('DANGER')
        .setCustomId('appMenuDelete')
    )
    await con.query(`SELECT * FROM applications WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) return interaction.deferUpdate();
        if(row[curr].closed) {
            await con.query(`UPDATE applications SET closed=false WHERE guildid='${interaction.guild.id}' AND uniqueid='${row[curr].uniqueid}'`, async (err, row) => {
                if(err) throw err;
            });
            buttons2.addComponents(
                new client.discord.MessageButton()
                .setLabel(language.globalButtons.open)
                .setStyle('SUCCESS')
                .setCustomId('appMenuToggleClosed')
            )
        } else {
            await con.query(`UPDATE applications SET closed=true WHERE guildid='${interaction.guild.id}' AND uniqueid='${row[curr].uniqueid}'`, async (err, row) => {
                if(err) throw err;
            });
            buttons2.addComponents(
                new client.discord.MessageButton()
                .setLabel(language.globalButtons.closed)
                .setStyle('DANGER')
                .setCustomId('appMenuToggleClosed')
            )
        }
        await interaction.update({ components: [buttons1, buttons2, buttons3] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    })
};