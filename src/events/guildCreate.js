module.exports = async function(client, con, guild) {
    await client.utils.guildAdd(client, con, guild.id);
    let language = require(`../utils/languages/${client.config.defaultLanguage || 'english'}.json`)
    await guild.members.cache.forEach(async (m) => {
        if(!m.user.bot) {
            await con.query(`SELECT * FROM economyusers WHERE guildid='${guild.id}' AND userid='${m.user.id}'`, async (err, row) => {
                if(err) throw err;
                if(!row[0]) {
                    await con.query(`INSERT INTO economyusers (guildid, userid, balance, bank, workCooldown, crimeCooldown, robCooldown) VALUES ('${guild.id}', '${m.user.id}', 0, 100, 'false', 'false', 'false')`, async (err, row) => {
                        if(err) throw err;
                    });
                };
            });
        };
    });
    if(client.config.guildLogs == "") return;
    let embed = new client.discord.MessageEmbed()
    .setColor('#041014')
    .setTitle(language.events.guilds.join)
    .setDescription(`${language.events.guilds.name} ${guild.name}\n${language.events.guilds.id} \`${guild.id}\``)
    .setTimestamp()
    .setFooter({ text: '❤️ Dark Bot - Hyperz#0001' })
    let channel = await client.channels.cache.get(client.config.guildLogs)
    if(channel != undefined) {
        await channel.send({ embeds: [embed] }).catch(e => {});
    };
}