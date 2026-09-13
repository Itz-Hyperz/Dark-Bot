module.exports = async function(client, con, interaction, data, language, gohome) {
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.options)
        .setStyle('SECONDARY')
        .setCustomId('settingsBaseToggleDisabled')
        .setDisabled(true)
    )
    if(data.verification) {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseVerification.buttons.verify)
            .setStyle('SUCCESS')
            .setCustomId('settingsBaseToggleVerify')
        )
    } else {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseVerification.buttons.verify)
            .setStyle('DANGER')
            .setCustomId('settingsBaseToggleVerify')
        )
    };
    if(data.captcha) {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseVerification.buttons.captcha)
            .setStyle('SUCCESS')
            .setCustomId('settingsBaseToggleCaptcha')
        )
    } else {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseVerification.buttons.captcha)
            .setStyle('DANGER')
            .setCustomId('settingsBaseToggleCaptcha')
        )
    };
    buttons.addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsBaseVerification.buttons.post)
        .setStyle('PRIMARY')
        .setCustomId('settingsBasePanelVerifyPost')
    )
    await interaction.update({ components: [buttons, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};