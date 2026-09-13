module.exports = async(client, con, message) => {

    if(!message) return;
    if(message.partial) await message.fetch();

    if(!message.author) return;
    if(message.author.bot) return;
    if(message.channel.type == 'DM') return;

    await client.snipes.set(message.channel.id, {
        content: message.content,
        author: message.author.tag,
        member: message.member,
        image: message.attachments.first() ? message.attachments.first().proxyURL : null
    });

    await con.query(`SELECT * FROM guilds WHERE guildid='${message.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) await client.utils.guildAdd(client, con, message.guild.id);
        let data = row[0];
        let language = require(`../utils/languages/${row[0]?.language || 'english'}.json`)
        let logembed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setAuthor({ name: `${language.logging.actionLogs} - ${language.events.messages.deleted}`, iconURL: client.user.displayAvatarURL() })
        .addFields(
            {name: `${language.logging.userId}:`, value: `${message.author.id}`},
            {name: `${language.logging.userTag}:`, value: `${message.author.tag}`},
            {name: `${language.events.messages.channel}:`, value: `<#${message.channel.id}>`},
            {name: `${language.events.messages.content}:`, value: `${message.content || language.events.messages.noContent}`},
        )
        .setTimestamp()
        await client.utils.sendLog(client, con, data, 'messagelogs', logembed);
    });

}
