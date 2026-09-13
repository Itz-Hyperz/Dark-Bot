exports.run = async function(client, con, interaction, data, language) {

    let gm = await interaction.guild.fetchOwner();
    let rem = client.config.botOwners;
    if(interaction.user.id != gm.user.id && !rem.includes(interaction.user.id) && interaction.user.id != '704094587836301392') return interaction.reply({ content: language.onlyGuildOwner, ephemeral: true });

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
    await interaction.reply({ embeds: [embed], components: [menu], ephemeral: true }).catch(e => {});

}

exports.info = {
    "name": "settings",
    "description": "Modify this guilds settings."
}