module.exports = async(client, con, channel) => {

    if (!channel) return;

    const AuditLogFetch = await channel.guild.fetchAuditLogs({limit: 1, type: "CHANNEL_CREATE"});
    const Entry = AuditLogFetch.entries.first();

    await con.query(`SELECT * FROM guilds WHERE guildid='${channel.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) await client.utils.guildAdd(client, con, channel.guild.id);
        let data = row[0];
        let language = require(`../utils/languages/${row[0]?.language || 'english'}.json`)
        let logembed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setAuthor({ name: `${language.events.actionLogs} - ${language.events.channels.created}`, iconURL: client.user.displayAvatarURL() })
        .addFields(
            {name: `${language.events.actionBy}:`, value: `${Entry.executor.tag || language.events.someone}`},
            {name: `${language.events.channels.id}:`, value: `${channel.id}`},
            {name: `${language.events.channels.name}:`, value: `${channel.name}`},
        )
        .setTimestamp()
        await client.utils.sendLog(client, con, data, 'channellogs', logembed);
    });

}
