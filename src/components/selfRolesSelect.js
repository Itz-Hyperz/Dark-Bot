module.exports = async function(client, con, interaction, data, language) {
    let selection = interaction.values[0];
    if(interaction.member.roles.cache.has(selection)) {
        interaction.member.roles.remove(selection).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    } else {
        interaction.member.roles.add(selection).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    };
    let embed = new client.discord.MessageEmbed()
    .setColor(data.themecolor || '#FFFFFF')
    .setTitle(interaction.message.embeds[0].title)
    .setDescription(interaction.message.embeds[0].description)
    interaction.update({ embeds: [embed] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};