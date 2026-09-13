module.exports = async(client, con, message, newMessage) => {

    if(newMessage?.parial) await newMessage?.fetch();
    if(message?.partial) await message?.fetch();

    if (!message.author) return;
    if (message?.author.bot) return;
    if(message?.channel.type == 'DM') return;

    if(message?.content == newMessage?.content) return;

    await con.query(`SELECT * FROM guilds WHERE guildid='${message?.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) await client.utils.guildAdd(client, con, message?.guild.id);
        let data = row[0];
        let language = require(`../utils/languages/${row[0]?.language || 'english'}.json`)

        await con.query(`SELECT * FROM filtered WHERE guildid='${newMessage.guild.id}'`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) return;
            await con.query(`SELECT * FROM perms WHERE guildid='${newMessage.guild.id}' AND permtype='filter' OR guildid='${newMessage.guild.id}' AND permtype='admin'`, async (err, perms) => {
                if(err) throw err;
                let permissions = [];
                await perms.forEach(async (perm) => {
                    permissions.push(perm.roleid);
                });
                if(!newMessage.member.roles.cache.some(h=>permissions.includes(h.id))) {
                    row.forEach(async (word) => {
                        if(newMessage.content.toLowerCase().includes(word.content)) {
                            await newMessage.delete().catch(e => {});
                            let logembed = new client.discord.MessageEmbed()
                            .setColor(data.themecolor || '#FFFFFF')
                            .setAuthor({ name: `${language.logging.actionLogs} - ${language.logging.types.filterSystem}`, iconURL: client.user.displayAvatarURL() })
                            .addFields(
                                {name: `${language.logging.userId}:`, value: `${newMessage.author.id}`},
                                {name: `${language.logging.userTag}:`, value: `${newMessage.author.tag}`},
                                {name: `${language.logging.types.blacklistedTerm}:`, value: `||${word.content}||`},
                            )
                            .setTimestamp()
                            await client.utils.sendLog(client, con, data, 'filterlogs', logembed);
                            await newMessage.channel.send({ content: `${language.logging.types.blacklistedTerm}: ||${word.content}|| - <@${newMessage.author.id}>` }).then((msg) => {
                                setTimeout(() => {
                                    msg.delete().catch(e => {});
                                }, 5000);
                            }).catch(e => {});
                        };
                    });
                };
            });
        });

        let logembed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setAuthor({ name: `${language.logging.actionLogs} - ${language.events.messages.updated}`, iconURL: client.user.displayAvatarURL() })
        .addFields(
            {name: `${language.events.updated.user}:`, value: `${message.author.tag} - (${message.author.id})`},
            {name: `${language.events.messages.channel}:`, value: `<#${message.channel.id}>`},
            {name: `${language.events.updated.before}:`, value: `${message?.content || 'Unknown...'}`},
            {name: `${language.events.updated.after}:`, value: `${newMessage?.content || 'Unknown...'}`},
        )
        .setTimestamp()
        await client.utils.sendLog(client, con, data, 'messagelogs', logembed);
    });

}
