const moment = require('moment');
const ms = require('ms');
module.exports = async function(client, con, language) {
    setInterval(async () => {
        await con.query(`SELECT * FROM guilds`, async (err, rows) => {
            if(err) throw err;
            rows.forEach(async (data) => {
                let datetime = moment().format('MM-DD').toString();
                await con.query(`SELECT * FROM birthdays WHERE guildid='${data.guildid}'`, async (err, rows) => {
                    if(err) throw err;
                    if(rows[0]) {
                        await rows.forEach(async r => {
                            if(r.deDate.toString().includes(datetime)) {
                                let guild = await client.guilds.cache.get(data.guildid)
                                let user = await client.users.fetch(r.userid)
                                if(guild.members.cache.get(user.id)) {
                                    let bdayembed = new client.discord.MessageEmbed()
                                    .setColor(data.themecolor || '#FFFFFF')
                                    .setTitle(language.components.birthdaySystem.title)
                                    .setThumbnail(user.avatarURL({ dynamic: true }) || `https://images.emojiterra.com/google/android-11/512px/1f389.png`)
                                    .setDescription(`${language.components.birthdaySystem.its} **${user.tag} (<@${user.id}>)'s** ${language.components.birthdaySystem.bday} ${r.deDate}`)
                                    .setTimestamp()
                                    await con.query(`SELECT * FROM channels WHERE guildid='${data.guildid}' AND channeltype='birthdaylogs'`, async (err, row) => {
                                        if(err) throw err;
                                        await row.forEach(async (chan) => {
                                            let thechannel = await client.channels.cache.get(chan.channelid)
                                            if(thechannel != undefined) {
                                                thechannel.send({ embeds: [bdayembed] }).catch(e => {})
                                            }
                                        });
                                    });
                                };
                            };
                        });
                    };
                });
            });
        });
    }, ms('24h'));
};