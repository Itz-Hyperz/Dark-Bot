exports.run = async function(client, con, interaction, data, language) {

    let gm = await interaction.guild.fetchOwner();
    let rem = client.config.botOwners;
    if(interaction.user.id != gm.user.id && !rem.includes(interaction.user.id) && interaction.user.id != '704094587836301392') return interaction.reply({ content: language.onlyGuildOwner, ephemeral: true });

    const controls = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('loggingDisabled2')
        .setStyle('SECONDARY')
        .setLabel(language.globalButtons.controls)
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('loggingBack')
        .setStyle('PRIMARY')
        .setLabel(language.globalButtons.back)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('loggingNext')
        .setStyle('PRIMARY')
        .setLabel(language.globalButtons.next)
    )
    const buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('loggingDisabled')
        .setStyle('SECONDARY')
        .setLabel(language.globalButtons.options)
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('loggingAdd')
        .setStyle('SUCCESS')
        .setLabel(language.logging.buttons.addChannel)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('loggingDelete')
        .setStyle('DANGER')
        .setLabel(language.globalButtons.deleteSelected)
    )
    await con.query(`SELECT * FROM channels WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(language.logging.commandEmbed.embedTitle)
        .setDescription(`${language.logging.commandEmbed.type} \`${row[0]?.channeltype || language.logging.commandEmbed.noChannel}\`\n${language.logging.commandEmbed.channel} <#${row[0]?.channelid || 'N/A'}>`)
        .setTimestamp()
        .setFooter({ text: '0' })
        await interaction.reply({ embeds: [embed], components: [controls, buttons], ephemeral: true }).catch(e => {});
    });

}

exports.info = {
    "name": "logging",
    "description": "Modify the logging settings for this guild."
}