module.exports = async function(client, con, interaction, data, language) {
    let pages = client.pages;
    let select = Number(interaction.values[0]);
    let embed = new client.discord.MessageEmbed()
    .setColor(data.themecolor || '#FFFFFF')
    .setTitle(`${client.user.username}${language.components.helpPageSelect.title}`)
    .setFooter({ text: `${language.components.helpPageSelect.footer} ❤️ ${language.components.helpPageSelect.by} Hyperz#0001` })
    .setDescription(pages[select])
    await interaction.update({ embeds: [embed] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};