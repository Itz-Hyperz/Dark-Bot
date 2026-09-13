module.exports = async function(client, con, interaction, data, language) {
    let selection = interaction.values[0];
    let gohome = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.home)
        .setStyle('SECONDARY')
        .setCustomId('settingsGoHome')
    )
    if(selection == 'settingsBaseGeneralSettings') {
        require('./settingsBaseGeneralSettings.js')(client, con, interaction, data, language, gohome);
    } else if(selection == 'settingsBaseWelcome') {
        require('./settingsBaseWelcome.js')(client, con, interaction, data, language, gohome);
    } else if(selection == 'settingsBaseLeave') {
        require('./settingsBaseLeave.js')(client, con, interaction, data, language, gohome);
    } else if(selection == 'settingsBaseVerification') {
        require('./settingsBaseVerification.js')(client, con, interaction, data, language, gohome);
    } else if(selection == 'settingsBaseAutorole') {
        require('./settingsBaseAutorole.js')(client, con, interaction, data, language, gohome);
    };
};