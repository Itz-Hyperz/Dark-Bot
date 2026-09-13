module.exports = async function(client, con, interaction, data, language) {
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
        if(row[0]?.closed) {
            buttons2.addComponents(
                new client.discord.MessageButton()
                .setLabel(language.globalButtons.closed)
                .setStyle('DANGER')
                .setCustomId('appMenuToggleClosed')
            )
        } else {
            buttons2.addComponents(
                new client.discord.MessageButton()
                .setLabel(language.globalButtons.open)
                .setStyle('SUCCESS')
                .setCustomId('appMenuToggleClosed')
            )
        };
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(language.components.appMenuGoHome.title)
        .setDescription(`**${language.components.appMenuGoHome.name}** ${row[0]?.appname || language.components.appMenuGoHome.noapps}`)
        .setTimestamp()
        .setFooter({ text: '0' })
        await interaction.update({ embeds: [embed], components: [buttons1, buttons2, buttons3], ephemeral: true }).catch(e => {
            console.log(e)
        }); 
    });
};