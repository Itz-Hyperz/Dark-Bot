module.exports = async function(client, con, guild) {
    // await client.utils.guildRemove(client, con, guild.id);
    let language = require(`../utils/languages/${client.config.defaultLanguage || 'english'}.json`)
    if(client.config.guildLogs == "") return;
    let embed = new client.discord.MessageEmbed()
    .setColor('#041014')
    .setTitle(language.events.guilds.leave)
    .setDescription(`${language.events.guilds.name} ${guild.name}\n${language.events.guilds.id} \`${guild.id}\``)
    .setTimestamp()
    .setFooter({ text: '❤️ Dark Bot - Hyperz#0001' })
    let channel = await client.channels.cache.get(client.config.guildLogs)
    if(channel != undefined) {
        await channel.send({ embeds: [embed] }).catch(e => {});
    };
};