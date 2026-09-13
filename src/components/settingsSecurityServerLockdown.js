module.exports = async function(client, con, interaction, data, language, gohome) {
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(`${language.components.settingsSecurityServerLockdown.a}`)
        .setStyle('SECONDARY')
        .setCustomId('settingsSecurityToggleDisabled')
        .setDisabled(true)
    )
    if(data.lockdown) {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(`${language.components.settingsSecurityServerLockdown.b}`)
            .setStyle('SUCCESS')
            .setCustomId('settingsSecurityToggleLockdown')
        )
    } else {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(`${language.components.settingsSecurityServerLockdown.c}`)
            .setStyle('DANGER')
            .setCustomId('settingsSecurityToggleLockdown')
        )
    }
    await interaction.update({ components: [buttons, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};