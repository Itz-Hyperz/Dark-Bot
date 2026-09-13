module.exports = async(client, con, role) => {

    if (!role) return;

    const AuditLogFetch = await role.guild.fetchAuditLogs({limit: 1, type: "ROLE_CREATE"});
    const Entry = AuditLogFetch.entries.first();

    if(!Entry) return;

    await con.query(`SELECT * FROM guilds WHERE guildid='${role.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) await client.utils.guildAdd(client, con, role.guild.id);
        let data = row[0];
        let language = require(`../utils/languages/${row[0]?.language || 'english'}.json`)
        let logembed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setAuthor({ name: `${language.logging.actionLogs} - ${language.events.roles.created}`, iconURL: client.user.displayAvatarURL() })
        .addFields(
            {name: `${language.events.roles.actionedBy}:`, value: `${Entry.executor.tag || language.events.someone}`},
            {name: `${language.events.roles.id}:`, value: `${role.id}`},
            {name: `${language.events.roles.name}:`, value: `${role.name}`},
        )
        .setTimestamp()
        await client.utils.sendLog(client, con, data, 'rolelogs', logembed);
    });

}
