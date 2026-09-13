module.exports = async function(client, con, interaction, guilddata, language) {
    
    let message = interaction.message
    await con.query(`SELECT * FROM giveaways WHERE messageid='${message.id}' AND active='false'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            if(interaction.user.id === row[0].starter) {
                let gid = row[0].uniqueid
                interaction.reply({ content: language.components.giveawayReroll.wait, ephemeral: true }).catch(e => {})
                let entrys = [];
                let winners = [];
                let bruhmoment = [];
                await con.query(`SELECT * FROM giveaways WHERE uniqueid='${gid}' AND active='false'`, async (err, row) => {
                    if(err) throw err;
                    if(row[0]) {
                        let bruh = row[0]
                        let yikes = Number(bruh.winners)
                        if (!yikes) return console.log(language.components.giveawayReroll.consoleNumber);
                        if(bruh) {
                            await con.query(`SELECT * FROM giveawayentrys WHERE gid='${gid}'`, async (err, rows) => {
                                if(err) throw err;
                                if(rows[0]) {
                                    await rows.forEach(r => {
                                        entrys.push(r.userid)
                                    });
                                    setTimeout(async () => {
                                        entrys.forEach(async e => {
                                            if(winners.length < yikes) {
                                                let random = await entrys[Math.floor(entrys.length * Math.random())];
                                                if(winners.length < yikes) {
                                                    if(!winners.includes(random)) {
                                                        winners.push(random)
                                                    }
                                                }
                                            }
                                        });
                                        await client.utils.giveawayCheck(entrys, winners, yikes)
                                        setTimeout(async () => {
                                            winners.forEach(async w => {
                                                if(winners.length > yikes) {
                                                    winners.pop()
                                                } else {
                                                    let deUser = await client.users.fetch(w)
                                                    bruhmoment.push(`${deUser.tag} (<@${deUser.id}>)`)
                                                }
                                            });
                                            setTimeout(async () => {
                                                const chantosend = await client.channels.cache.get(bruh.channelid)
                                                const creator = await client.users.fetch(bruh.starter)
                                                const final = new client.discord.MessageEmbed()
                                                .setColor(guilddata.themecolor)
                                                    .setTitle(language.components.giveawayReroll.title)
                                                .setThumbnail(chantosend.guild.iconURL({ dynamic: true }) || client.user.avatarURL({ dynamic: true }))
                                                    .setDescription(`${language.components.giveawayReroll.prize} ${bruh.prize}\n${language.components.giveawayReroll.winners} ${bruh.winners}\n${language.components.giveawayReroll.time} ${bruh.timelimit}\n\n${language.components.giveawayReroll.winners2}\n${bruhmoment.join('\n')}`)
                                                    .setFooter({ text: `${language.components.giveawayReroll.footer}${creator.tag}` })
                                                await con.query(`UPDATE giveaways SET active='false' WHERE uniqueid='${bruh.uniqueid}'`, async (err, row) => {
                                                    if(err) throw err;
                                                });
                                                await chantosend.send({ embeds: [final] }).then(() => {
                                                    entrys = [];
                                                    winners = [];
                                                    bruhmoment = [];
                                                }).catch(e => {
                                                    console.log(`\n${language.components.giveawayReroll.endError}`, e.stack)
                                                });
                                            }, 4000);

                                        }, 6000);
                                    }, 5000);
                                };
                            });
                        };
                    };
                });
            } else {
                interaction.reply({ content: language.components.giveawayReroll.uNot, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            };
        } else {
            await con.query(`SELECT * FROM giveaways WHERE messageid='${message.id}' AND active='true'`, async (err, row) => {
                if(err) throw err;
                if(row[0]) {
                    if(interaction.user.id === row[0].starter) {
                        interaction.reply({ content: language.components.giveawayReroll.wait1, ephemeral: true }).then(msg => {
                        }).catch(e => {})
                    } else {
                        interaction.reply({ content: language.components.giveawayReroll.uNot, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    };
                } else {
                    interaction.reply({ content: language.components.giveawayReroll.find, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                };
            });
        }
    });

};
// components.