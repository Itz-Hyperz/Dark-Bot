module.exports = async function(client, con, interaction, data, language) {
    const controls = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('permsDisabled2')
        .setStyle(`SECONDARY`)
        .setLabel(`${language.globalButtons.controls}`)
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('permsBack')
        .setStyle('PRIMARY')
        .setLabel(`${language.globalButtons.back}`)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('permsNext')
        .setStyle('PRIMARY')
        .setLabel(`${language.globalButtons.next}`)
    )
    const buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('permsDisabled')
        .setStyle('SECONDARY')
        .setLabel(`${language.globalButtons.options}`)
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('permsAdd')
        .setStyle('SUCCESS')
        .setLabel(`${language.components.permsHome.buttons.add}`)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setCustomId('permsDelete')
        .setStyle('DANGER')
        .setLabel(`${language.components.permsHome.buttons.delete}`)
    )
    await con.query(`SELECT * FROM perms WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(`${language.components.permsHome.title}`)
        .setDescription(`${language.components.permsHome.type} \`${row[0]?.permtype || language.components.permsHome.no}\`\n${language.components.permsHome.role} <@&${row[0]?.roleid || 'N/A'}>`)
        .setTimestamp()
        .setFooter({ text: '0' })
        await interaction.update({ embeds: [embed], components: [controls, buttons], ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });

};