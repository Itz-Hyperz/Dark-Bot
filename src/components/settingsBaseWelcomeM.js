module.exports = async function(client, con, interaction, data, language) {

    await con.query(`UPDATE guilds SET welcometype='message' WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
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
        .setLabel(language.globalButtons.options)
        .setStyle('SECONDARY')
        .setCustomId('settingsBaseWelcomeOptionsDisabled')
        .setDisabled(true)
    )
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
    
    await interaction.update({ components: [buttons, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });

};