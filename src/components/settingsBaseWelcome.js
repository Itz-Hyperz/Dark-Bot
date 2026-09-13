module.exports = async function(client, con, interaction, data, language, gohome) {
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.options)
        .setStyle('SECONDARY')
        .setCustomId('settingsBaseWelcomeOptionsDisabled')
        .setDisabled(true)
    )
    if(data.welcometype == 'message') {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.message)
            .setStyle('PRIMARY')
            .setCustomId('settingsBaseWelcomeM')
        )
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.embed)
            .setStyle('SECONDARY')
            .setCustomId('settingsBaseWelcomeE')
        )
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.card)
            .setStyle('SECONDARY')
            .setCustomId('settingsBaseWelcomeC')
        )
    } else if (data.welcometype == 'embed') {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.message)
            .setStyle('SECONDARY')
            .setCustomId('settingsBaseWelcomeM')
        )
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.embed)
            .setStyle('PRIMARY')
            .setCustomId('settingsBaseWelcomeE')
        )
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.card)
            .setStyle('SECONDARY')
            .setCustomId('settingsBaseWelcomeC')
        )
    } else if (data.welcometype == 'card') {
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.message)
            .setStyle('SECONDARY')
            .setCustomId('settingsBaseWelcomeM')
        )
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.embed)
            .setStyle('SECONDARY')
            .setCustomId('settingsBaseWelcomeE')
        )
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.card)
            .setStyle('PRIMARY')
            .setCustomId('settingsBaseWelcomeC')
        )
    }
    
    await interaction.update({ components: [buttons, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });

};