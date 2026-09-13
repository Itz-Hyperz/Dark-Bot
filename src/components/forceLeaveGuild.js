module.exports = async function(client, con, interaction, data, language) {
    let str = interaction.message.embeds[0].description
    let mod = str.split('**○ Guild Id:** ')[1].split('\n*')[0]
    let guild = await client.guilds.cache.get(mod)
    let guildListButtons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setStyle(`SECONDARY`)
            .setLabel(`${language.globalButtons.back}`)
        .setCustomId('backGuilds')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setStyle(`SECONDARY`)
        .setLabel(`${language.globalButtons.next}`)
        .setCustomId('nextGuilds')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setStyle(`DANGER`)
            .setLabel(`${language.components.forceLeaveGuild.left}`)
        .setCustomId('forceLeaveGuildDisabled')
        .setDisabled(true)
    )
    await guild.leave()
    interaction.update({ components: [guildListButtons] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};