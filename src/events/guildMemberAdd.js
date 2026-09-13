const ms = require('ms');
const Canvas = require("discord-canvas");
module.exports = async(client, con, guildMember) => {
    let ld = false; // lockdown variable
    await con.query(`SELECT * FROM guilds WHERE guildid='${guildMember.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) await client.utils.guildAdd(client, con, guildMember.guild.id);
        let data = row[0];
        let language = require(`../utils/languages/${row[0]?.language || 'english'}.json`)
        await con.query(`SELECT * FROM offlinebans WHERE guildid='${guildMember.guild.id}' AND userid='${guildMember.user.id}'`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) return;
            await guildMember.ban({
                reason: `${row[0].reason} | ${row[0].enforcerid}`
            }).catch(e => {
                if(client.config.debugmode) console.log(e);
            });
        });
        if(data.lockdown) {
            let lockdownembed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setTitle(language.events.members.lockdownTitle)
            .setDescription(`${language.events.members.sorry}, **${guildMember.guild.name}** ${language.events.members.lockdown}`)
            .setTimestamp()
            try { lockdownembed.setThumbnail(guildMember.guild.iconURL({ dynamic: true })) } catch(e) {}
            await guildMember.user.send({ embeds: [lockdownembed] }).then(async () => {
                await guildMember.guild.members.kick(guildMember, {
                    reason: JSON.stringify(language.events.members.lockdownMode)
                });
            }).catch(async () => {
                await guildMember.guild.members.kick(guildMember, {
                    reason: JSON.stringify(language.events.members.lockdownMode)
                });
            });
            let logembed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setTitle(language.events.members.lockdownRemoval)
            .setThumbnail(`${guildMember.user.avatarURL({dynamic: true})}`)
            .addFields(
                {name: `${language.events.members.user}:`, value: `${guildMember.user.tag}`},
                {name: `${language.events.members.action}:`, value: `${language.events.members.kicked}`},
                {name: `${language.events.members.reason}:`, value: `${language.events.members.lockdownMode}`},
            )
            .setTimestamp()
            await client.utils.sendLog(client, con, data, 'serverlocklogs', logembed);
            ld=true;
        };
        if(ld == false) {
            if(data.altprev) {
                if (Date.now() - guildMember.user.createdAt < ms(data.altprevtime)) {
                    if(guildMember.user.bot) return;
                    await con.query(`SELECT * FROM channels WHERE guildid='${guildMember.guild.id}' AND channeltype="altprevlogs"`, async (err, row) => {
                        if(err) throw err;
                        if(row[0]) {
                            let logEmbed = new client.discord.MessageEmbed()
                            .setColor(data.themecolor || '#FFFFFF')
                            .setTitle(language.events.members.altDetected)
                            .setDescription(`**${language.events.members.user}:** ${guildMember.user.tag} - (${guildMember.user.id})\n**${language.events.members.accountAge}:** ${guildMember.user.createdAt.toLocaleString()}`)
                            .setTimestamp()
                            try { logEmbed.setThumbnail(guildMember.user.avatarURL({ dynamic: true })) } catch(e) {}
                            await row.forEach(async r => {
                                let channel = await client.channels.cache.get(r.channelid)
                                if(channel) channel.send({ embeds: [logEmbed] }).catch(e => {});
                            });
                        };
                    });
                    let embed = new client.discord.MessageEmbed()
                    .setColor(data.themecolor || '#FFFFFF')
                    .setTitle(language.events.members.removalTitle)
                    .setDescription(`${language.events.members.removal1} **${guildMember.guild.name}** ${language.events.members.removal2}`)
                    .setTimestamp()
                    try { embed.setThumbnail(guildMember.guild.iconURL({ dynamic: true })) } catch(e) {}
                    try {
                        await guildMember.user.send({ embeds: [embed] }).then(() => {
                            altKick(client, guildMember, language)
                        }).catch(e => {
                            altKick(client, guildMember, language)
                        });
                    } catch(e) {
                        if(client.config.debugmode) console.log(e)
                    }
                };
            };
            if(data.autorole) {
                await con.query(`SELECT * FROM autoroles WHERE guildid='${guildMember.guild.id}' AND verify=false`, async (err, row) => {
                    if(err) throw err;
                    if(!row[0]) return;
                    await row.forEach(async (r) => {
                        if(!guildMember?.roles?.cache?.has(r.roleid)) {
                            await guildMember.roles.add(r.roleid).catch(e => {});
                        };
                    });
                });
            };
        };
        await con.query(`SELECT * FROM channels WHERE guildid='${guildMember.guild.id}' AND channeltype='welcome'`, async (err, row) => {
            if(err) throw err;
            if(data.welcometype == 'message') {
                await row.forEach(async (r) => {
                    let channel = await client.channels.cache.get(r.channelid)
                    if(channel != undefined) {
                        await channel.send({ content: `👋 <@${guildMember.user.id}> (${guildMember.user.tag})\n${language.events.members.join}` }).catch(e => {});
                    }
                });
            } else if(data.welcometype == 'embed') {
                let welcomeEmbed = new client.discord.MessageEmbed()
                .setColor(data.themecolor || '#FFFFFF')
                .setTitle(language.events.members.joinEmbedTitle)
                .setDescription(`<@${guildMember.user.id}> (${guildMember.user.tag})\n${language.events.members.join}`)
                try {
                    await welcomeEmbed.addField(`${language.events.members.accountAge}:`, guildMember.user.createdAt.toLocaleString(), false)
                    await welcomeEmbed.setThumbnail(guildMember.user.avatarURL())
                } catch(e) {}
                await row.forEach(async (r) => {
                    let channel = await client.channels.cache.get(r.channelid)
                    if(channel != undefined) {
                        await channel.send({ embeds: [welcomeEmbed] }).catch(e => {});
                    }
                });
            } else if(data.welcometype == 'card') {
                const image = await new Canvas.Welcome()
                .setUsername(guildMember.user.username)
                .setDiscriminator(guildMember.user.discriminator)
                .setMemberCount(guildMember.guild.members.cache.size)
                .setGuildName(guildMember.guild.name)
                .setAvatar(guildMember.user.avatarURL({dynamic: true, format: "png"}))
                .setColor("border", data.themecolor)
                .setColor("username-box", data.themecolor)
                .setColor("discriminator-box", data.themecolor)
                .setColor("message-box", data.themecolor)
                .setColor("title", '#FFFFFF')
                .setColor("avatar", data.themecolor)
                .setBackground(data.welcomecardurl)
                .toAttachment();
    
                let attachment = new client.discord.MessageAttachment(image.toBuffer(), 'welcome.png');
                await row.forEach(async (r) => {
                    let channel = await client.channels.cache.get(r.channelid)
                    if(channel != undefined) {
                        await channel.send({ files: [attachment] }).catch(e => {});
                    };
                });
            };
        });
        await con.query(`SELECT * FROM channels WHERE guildid='${guildMember.guild.id}'`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) return;
            let memberc = [];
            let userc = [];
            await row.forEach(async (r) => {
                if(r.channeltype == 'membercount') memberc.push(r.channelid);
                if(r.channeltype == 'usercount') userc.push(r.channelid);
            });
            memberc.forEach(async (c) => {
                let cn = await client.channels.cache.get(c)
                if(cn != undefined) {
                    await cn.setName(`${language.events.members.members}: ${guildMember.guild.memberCount.toLocaleString()}`)
                };
            });
            userc.forEach(async (c) => {
                let cn = await client.channels.cache.get(c)
                if(cn != undefined) {
                    await cn.setName(`${language.events.members.users}: ${guildMember.guild.members.cache.filter(member => !member.user.bot).size}`)
                };
            });
        });
    });

};

async function altKick(client, guildMember, language) {
    try {
        guildMember.guild.members.kick(guildMember, {
            reason: JSON.stringify(language.events.members.altDetected)
        });
    } catch(e) {}
};