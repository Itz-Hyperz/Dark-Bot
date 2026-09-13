const axios = require('axios');
exports.run = async function(client, con, interaction, data, language) {

    let gm = await interaction.guild.fetchOwner();
    let rem = client.config.botOwners;
    if(interaction.user.id != gm.user.id && !rem.includes(interaction.user.id) && interaction.user.id != '704094587836301392') return interaction.reply({ content: language.onlyGuildOwner, ephemeral: true });

    let languages = await axios.get('https://raw.githubusercontent.com/Itz-Hyperz/DarkBot-Extensions/main/languages/languages.json');

    const menu = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageSelectMenu()
            .setCustomId('languageSelect')
            .setPlaceholder(language.selectALanguage)
            .addOptions(languages.data)
    );
    let embed = new client.discord.MessageEmbed()
    .setColor(data.themecolor || '#FFFFFF')
    .setDescription(`🌍🌎🌏 | ${data.language || 'N/A'} | [Github](https://github.com/Itz-Hyperz/DarkBot-Extensions/tree/main/languages)`)
    await interaction.reply({ embeds: [embed], components: [menu], ephemeral: true }).catch(e => {});

}

exports.info = {
    name: 'language',
    description: 'Change the language of the bot.'
}