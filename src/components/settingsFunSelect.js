module.exports = async function(client, con, interaction, data, language) {
    let selection = interaction.values[0];
    let gohome = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.home)
        .setStyle('SECONDARY')
        .setCustomId('settingsGoHome')
    )
    if(selection == 'settingsFunLevelSystem') {
        require('./settingsFunLevelSystem.js')(client, con, interaction, data, language, gohome);
    } else if(selection == 'settingsFunBirthdays') {
        require('./settingsFunBirthdays.js')(client, con, interaction, data, language, gohome);
    } else if(selection == 'settingsFunEconomy') {
        require('./settingsFunEconomy.js')(client, con, interaction, data, language, gohome);
    } else if(selection == 'settingsFunAutoReact') {
        require('./settingsFunAutoReact.js')(client, con, interaction, data, language, gohome);
    } else if(selection == 'settingsFunAutoRespond') {
        require('./settingsFunAutoRespond.js')(client, con, interaction, data, language, gohome);
    };
};