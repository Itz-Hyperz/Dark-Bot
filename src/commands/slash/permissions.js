exports.run = async function(client, con, interaction, data, language) {

    let gm = await interaction.guild.fetchOwner();
    let rem = client.config.botOwners;
    if(interaction.user.id != gm.user.id && !rem.includes(interaction.user.id) && interaction.user.id != '704094587836301392') return interaction.reply({ content: language.onlyGuildOwner, ephemeral: true });

    const controls = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('permsDisabled2')
        .setStyle('SECONDARY')
        .setLabel(language.globalButtons.controls)
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('permsBack')
        .setStyle('PRIMARY')
        .setLabel(language.globalButtons.back)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('permsNext')
        .setStyle('PRIMARY')
        .setLabel(language.globalButtons.next)
    )
    const buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('permsDisabled')
        .setStyle('SECONDARY')
        .setLabel(language.globalButtons.options)
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('permsAdd')
        .setStyle('SUCCESS')
        .setLabel(language.permissions.addPermission)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('permsDelete')
        .setStyle('DANGER')
        .setLabel(language.globalButtons.deleteSelected)
    )
    await con.query(`SELECT * FROM perms WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(language.permissions.embedTitle)
        .setDescription(`${language.permissions.type} \`${row[0]?.permtype || language.permissions.noPermsYet}\`\n${language.permissions.role} <@&${row[0]?.roleid || 'N/A'}>`)
        .setTimestamp()
        .setFooter({ text: '0' })
        await interaction.reply({ embeds: [embed], components: [controls, buttons], ephemeral: true }).catch(e => {});
    });

}

exports.info = {
    "name": "permissions",
    "description": "Modify this guilds permissions."
}