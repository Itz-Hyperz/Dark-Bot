module.exports = async function(client, con, interaction, data, language, gohome) {
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsBaseLeave.options)
        .setStyle('SECONDARY')
        .setCustomId('settingsBaseLeaveOptionsDisabled')
        .setDisabled(true)
    )
    if(data.leavetype == 'message') {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseLeave.message)
            .setStyle('PRIMARY')
            .setCustomId('settingsBaseLeaveM')
        )
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseLeave.embed)
            .setStyle('SECONDARY')
            .setCustomId('settingsBaseLeaveE')
        )
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseLeave.card)
            .setStyle('SECONDARY')
            .setCustomId('settingsBaseLeaveC')
        )
    } else if (data.leavetype == 'embed') {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseLeave.message)
            .setStyle('SECONDARY')
            .setCustomId('settingsBaseLeaveM')
        )
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseLeave.embed)
            .setStyle('PRIMARY')
            .setCustomId('settingsBaseLeaveE')
        )
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseLeave.card)
            .setStyle('SECONDARY')
            .setCustomId('settingsBaseLeaveC')
        )
    } else if (data.leavetype == 'card') {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseLeave.message)
            .setStyle('SECONDARY')
            .setCustomId('settingsBaseLeaveM')
        )
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseLeave.embed)
            .setStyle('SECONDARY')
            .setCustomId('settingsBaseLeaveE')
        )
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseLeave.card)
            .setStyle('PRIMARY')
            .setCustomId('settingsBaseLeaveC')
        )
    }
    
    await interaction.update({ components: [buttons, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });

};