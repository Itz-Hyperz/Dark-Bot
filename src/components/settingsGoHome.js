module.exports = async function(client, con, interaction, data, language) {
    const menu = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageSelectMenu()
            .setCustomId('settingsSelect')
            .setPlaceholder(language.settings.selectAction)
            .addOptions([
                {
                    label: language.settings.base,
                    description: language.settings.baseDesc,
                    value: 'settingsBase',
                },
                {
                    label: language.settings.security,
                    description: language.settings.securityDesc,
                    value: 'settingsSecurity',
                },
                {
                    label: language.settings.fun,
                    description: language.settings.funDesc,
                    value: 'settingsFun',
                }
            ]),
    );
    let embed = new client.discord.MessageEmbed()
    .setColor(data.themecolor || '#FFFFFF')
    .setTitle(language.settings.embedTitle)
    .setDescription(language.settings.embedDesc)
    .setTimestamp()
    await interaction.update({ embeds: [embed], components: [menu], ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};