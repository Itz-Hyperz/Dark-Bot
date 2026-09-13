module.exports = async(client, con, oldChannel, newChannel) => {

    if(oldChannel.partial) await oldChannel.fetch()
    if(newChannel.partial) await newChannel.fetch()
    if(oldChannel.type == 'category') return;
    if(newChannel.type == 'category') return;
    if(!oldChannel.parent) return;
    if(!newChannel.parent) return;

    const AuditLogFetch = await newChannel?.guild?.fetchAuditLogs({limit: 1, type: "CHANNEL_UPDATE"});
    if(!AuditLogFetch) return;
    const Entry = AuditLogFetch.entries.first();
    if(!Entry) return;

    await con.query(`SELECT * FROM channels WHERE guildid='${oldChannel.guild.id}' AND channeltype='membercount' OR guildid='${oldChannel.guild.id}' AND channeltype='usercount'`, async (err, row) => {
        if(err) throw err;
        if(oldChannel.id == row[0]?.channelid) return;
        await con.query(`SELECT * FROM guilds WHERE guildid='${oldChannel.guild.id}'`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) await client.utils.guildAdd(client, con, oldChannel.guild.id);
            let data = row[0];
            let language = require(`../utils/languages/${row[0]?.language || 'english'}.json`)
            let logembed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setAuthor({ name: `${language.events.actionLogs} - ${language.events.channels.updated}`, iconURL: client.user.displayAvatarURL() })
            .addFields(
                {name: `${language.events.actionBy}:`, value: `${Entry.executor.tag || language.events.someone}`},
                {name: `${language.events.updated.before}:`, value: `\`${language.events.updated.name}:\` ${oldChannel.name}\n\`${language.events.updated.type}:\` ${oldChannel.type}\n\`${language.events.updated.id}:\` ${oldChannel.id}\n\`${language.events.updated.created}:\` ${oldChannel.createdAt.toLocaleString()}`},
                {name: `${language.events.updated.after}:`, value: `\`${language.events.updated.name}:\` ${newChannel.name}\n\`${language.events.updated.type}:\` ${newChannel.type}\n\`${language.events.updated.id}:\` ${newChannel.id}\n\`${language.events.updated.created}:\` ${newChannel.createdAt.toLocaleString()}`},
            )
            .setTimestamp()
            await client.utils.sendLog(client, con, data, 'channellogs', logembed);
        });
    });

}
