module.exports = async function(client, con, interaction, data, language, gohome) {
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsSecurityAltPrevention.a)
        .setStyle('SECONDARY')
        .setCustomId('settingsSecurityToggleDisabled')
        .setDisabled(true)
    )
    if(data.altprev) {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsSecurityAltPrevention.b)
            .setStyle('SUCCESS')
            .setCustomId('settingsSecurityToggleAltPrev')
        )
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsSecurityAltPrevention.c)
            .setStyle('SECONDARY')
            .setCustomId('settingsSecurityAltPrevTime')
        )
        await interaction.update({ components: [buttons, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    } else {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsSecurityAltPrevention.b)
            .setStyle('DANGER')
            .setCustomId('settingsSecurityToggleAltPrev')
        )
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsSecurityAltPrevention.c)
            .setStyle('SECONDARY')
            .setCustomId('settingsSecurityAltPrevTime')
        )
        await interaction.update({ components: [buttons, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    }
};