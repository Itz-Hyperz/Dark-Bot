module.exports = async(client, con, oldRole, newRole) => {

    if (!oldRole || !newRole) return;

    const AuditLogFetch = await newRole.guild.fetchAuditLogs({limit: 1, type: "ROLE_UPDATE"});
    const Entry = AuditLogFetch.entries.first();

    if(!Entry) return;

    await con.query(`SELECT * FROM guilds WHERE guildid='${newRole.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) await client.utils.guildAdd(client, con, newRole.guild.id);
        let data = row[0];
        let language = require(`../utils/languages/${row[0]?.language || 'english'}.json`)
        let logembed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setAuthor({ name: `${language.logging.actionLogs} - ${language.events.roles.updated}`, iconURL: client.user.displayAvatarURL() })
        .addFields(
            {name: `${language.events.actionBy}:`, value: `${Entry.executor.tag || language.events.someone}`},
            {name: `${language.events.updated.before}:`, value: `\`${language.events.updated.name}:\` ${oldRole.name}\n\`${language.events.updated.color}:\` ${oldRole.hexColor}\n\`${language.events.updated.id}:\` ${oldRole.id}\n\`${language.events.updated.created}:\` ${oldRole.createdAt.toLocaleString()}\n\`${language.events.updated.position}:\` ${oldRole.position}\n\`${language.events.updated.hoisted}:\` ${oldRole.hoist}\n\`${language.events.updated.mentionable}:\` ${oldRole.mentionable}`},
            {name: `${language.events.updated.after}:`, value: `\`${language.events.updated.name}:\` ${newRole.name}\n\`${language.events.updated.color}:\` ${newRole.hexColor}\n\`${language.events.updated.id}:\` ${newRole.id}\n\`${language.events.updated.created}:\` ${newRole.createdAt.toLocaleString()}\n\`${language.events.updated.position}:\` ${newRole.position}\n\`${language.events.updated.hoisted}:\` ${newRole.hoist}\n\`${language.events.updated.mentionable}:\` ${newRole.mentionable}`},
        )
        .setTimestamp()
        await client.utils.sendLog(client, con, data, 'rolelogs', logembed);
    });

}
