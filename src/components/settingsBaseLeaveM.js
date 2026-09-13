module.exports = async function(client, con, interaction, data, language) {

    await con.query(`UPDATE guilds SET leavetype='message' WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
    });

    let gohome = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.home)
        .setStyle('SECONDARY')
        .setCustomId('settingsGoHome')
    )

    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsBaseLeave.options)
        .setStyle('SECONDARY')
        .setCustomId('settingsBaseLeaveOptionsDisabled')
        .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsBaseLeave.message)
        .setStyle('PRIMARY')
        .setCustomId('settingsBaseLeaveM')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsBaseLeave.embed)
        .setStyle('SECONDARY')
        .setCustomId('settingsBaseLeaveE')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsBaseLeave.card)
        .setStyle('SECONDARY')
        .setCustomId('settingsBaseLeaveC')
    )
    
    await interaction.update({ components: [buttons, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });

};