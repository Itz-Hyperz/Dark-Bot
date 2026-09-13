module.exports = async function(client, con, interaction, data, language) {
    let selection = interaction.values[0];
    let gohome = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.components.settingsSecuritySelect.a)
        .setStyle('SECONDARY')
        .setCustomId('settingsGoHome')
    )
    if(selection == 'settingsSecurityAltPrevention') {
        require('./settingsSecurityAltPrevention.js')(client, con, interaction, data, language, gohome);
    } else if(selection == 'settingsSecurityServerLockdown') {
        require('./settingsSecurityServerLockdown.js')(client, con, interaction, data, language, gohome);
    } else if(selection == 'settingsSecurityFilter') {
        require('./settingsSecurityFilter.js')(client, con, interaction, data, language, gohome);
    };
};