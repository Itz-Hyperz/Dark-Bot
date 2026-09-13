const Canvas = require("discord-canvas");
module.exports = async(client, con, guildMember) => {

    await con.query(`SELECT * FROM guilds WHERE guildid='${guildMember.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) await client.utils.guildAdd(client, con, guildMember.guild.id);
        let data = row[0];
        let language = require(`../utils/languages/${row[0]?.language || 'english'}.json`)
        await con.query(`SELECT * FROM channels WHERE guildid='${guildMember.guild.id}' AND channeltype='leave'`, async (err, row) => {
            if(err) throw err;
            if(data.leavetype == 'message') {
                await row.forEach(async (r) => {
                    let channel = await client.channels.cache.get(r.channelid)
                    if(channel != undefined) {
                        await channel.send({ content: `👋 <@${guildMember.user.id}> (${guildMember.user.tag})\n${language.events.members.left}` }).catch(e => {});
                    }
                });
            } else if(data.leavetype == 'embed') {
                let leaveEmbed = new client.discord.MessageEmbed()
                .setColor(data.themecolor || '#FFFFFF')
                .setTitle(language.events.members.leftEmbedTitle)
                .setDescription(`<@${guildMember.user.id}> (${guildMember.user.tag})\n${language.events.members.left}`)
                try {
                    await leaveEmbed.addField(`${language.events.members.accountAge}:`, guildMember.user.createdAt.toLocaleString(), false)
                    await leaveEmbed.setThumbnail(guildMember.user.avatarURL())
                } catch(e) {}
                await row.forEach(async (r) => {
                    let channel = await client.channels.cache.get(r.channelid)
                    if(channel != undefined) {
                        await channel.send({ embeds: [leaveEmbed] }).catch(e => {});
                    }
                });
            } else if(data.leavetype == 'card') {
                const image = await new Canvas.Goodbye()
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
    
                let attachment = new client.discord.MessageAttachment(image.toBuffer(), 'goodbye.png');
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
        if(data.levelkick) {
            await con.query(`DELETE FROM chatlvl WHERE guildid='${data.guildid}' AND userid='${guildMember.user.id}'`, async (err, row) => {
                if(err) throw err;
            });
        };
    });

};