module.exports = async function(client, con, interaction, data, language) {

    await con.query(`UPDATE guilds SET welcometype='card' WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
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
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.message)
        .setStyle('SECONDARY')
        .setCustomId('settingsBaseWelcomeM')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.embed)
        .setStyle('SECONDARY')
        .setCustomId('settingsBaseWelcomeE')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.card)
        .setStyle('PRIMARY')
        .setCustomId('settingsBaseWelcomeC')
    )
    
    await interaction.update({ components: [buttons, gohome] }).catch(e => {
        console.log(e)
    });

};