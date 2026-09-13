const chalk = require('chalk');

async function colorize(color, content) {
    switch (color, content) {
        case "red":
            return chalk.red(content)
        case "green":
            return chalk.green(content)
        case "yellow":
            return chalk.yellow(content)
        case "blue":
            return chalk.blue(content)
        case "cyan":
            return chalk.cyan(content)
        case "white":
            return chalk.white(content)
        case "black":
            return chalk.black(content)
        default:
            return chalk.white(content);
    };
};

async function guildAdd(client, con, id) {
    await con.query(`SELECT * FROM guilds WHERE guildid='${id}'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) return;
        await con.query(`INSERT INTO guilds (guildid, themecolor, language, toslink, paypal, cashapp, custompay, welcometype, leavetype, altprevtime, currency, maxtickets, muterole, welcomecardurl, verification, autorole, altprev, lockdown, leveling, levelkick, birthdays) VALUES ("${id}", "#041014", "${client.config.defaultLanguage || 'english'}", "http://domain.ext", "NA", "NA", "NA", "embed", "embed", "5d", ":moneybag:", 5, "0", "${client.config.cardBgURL}", false, false, false, false, false, false, false)`, async (err, row) => {
            if(err) throw err;
        });
    });
    return 0;
};

async function guildRemove(client, con, id) {
    await con.query(`SELECT * FROM guilds WHERE guildid='${id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return;
        await con.query(`DELETE FROM guilds WHERE guildid='${id}'`, async (err, row) => {
            if(err) throw err;
        });
    });
};

async function sendLog(client, con, data, type, logEmbed, obj) {
    if(type == undefined) return;
    if(data == 'skip') {
        await con.query(`SELECT * FROM channels WHERE channeltype='${type}'`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) return;
            await row.forEach(async (r) => {
                let chan = await client.channels.cache.get(r.channelid)
                if(chan != undefined) {
                    if(obj?.components[0]) {
                        await chan.send({ embeds: [logEmbed], components: obj?.components }).catch(e => {});
                    } else {
                        await chan.send({ embeds: [logEmbed] }).catch(e => {});
                    }
                };
            });
        });
    } else {
        await con.query(`SELECT * FROM channels WHERE guildid='${data.guildid}' AND channeltype='${type}'`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) return;
            await row.forEach(async (r) => {
                let chan = await client.channels.cache.get(r.channelid)
                if(chan != undefined) {
                    if(obj?.components[0]) {
                        await chan.send({ embeds: [logEmbed], components: obj?.components }).catch(e => {});
                    } else {
                        await chan.send({ embeds: [logEmbed] }).catch(e => {});
                    }
                };
            });
        });
    };
};

async function makeCase(client, con, data, userid, enforcerid, type, reason, logembed) {
    await con.query(`SELECT COUNT(caseid) AS total FROM cases WHERE guildid='${data.guildid}'`, async (err, row) => {
        if(err) throw err;
        let uniqueid = row[0].total + 1;
        let timedate = (new Date).toDateString();
        await con.query(`INSERT INTO cases (guildid, caseid, userid, enforcerid, casetype, reason, timedate) VALUES ("${data.guildid}", "${uniqueid}", "${userid}", "${enforcerid}", "${type}", "${reason}", "${timedate}")`, async (err, row) => {
            if(err) throw err;
        });
        await logembed.setFooter({ text: `Case Id: ${uniqueid}` });
        await sendLog(client, con, data, 'modlogs', logembed);
    });
};

async function error(client, content) {
    if(client.config.debugmode) {
        console.log(chalk.red('DEBUG MODE ERROR: ', content, `\n ${content.stack}`))
    }
};

async function sendError(string, channel) {
    await channel.send({ content: string }).catch(e => {});
};

async function userFetch(client, content) {
    let deUser;
    deUser = await client.users.fetch(content)
    if(deUser !== undefined) {
        return deUser;
    } else {
        if(client.config.debugmode) {
            console.log(chalk.red('DEBUG MODE ERROR: Unable to fetch user with provided ID in utils.js line 35.'))
        }
    }
};

async function memberFetch(client, guild, content) {
    let deUser;
    deUser = await guild.members.cache.get(content)
    if(deUser !== undefined) {
        return deUser;
    } else {
        if(client.config.debugmode) {
            console.log(chalk.red('DEBUG MODE ERROR: Unable to fetch user with provided ID in utils.js line 35.'))
        }
    }
};

async function giveawayPick(client, con, gid, data) {
    let entrys = [];
    let winners = [];
    let bruhmoment = [];
    await con.query(`SELECT * FROM giveaways WHERE uniqueid='${gid}' AND active='true'`, async (err, row) => {
        if(err) throw err;
        let bruh = row[0]
        let yikes = Number(bruh.winners)
        if(!yikes) return console.log(`A giveaways winners count is not a number...`);
        if(bruh) {
            await con.query(`SELECT * FROM giveawayentrys WHERE gid='${gid}'`, async (err, rows) => {
                if(err) throw err;
                if(rows[0]) {
                    await rows.forEach(r => {
                        entrys.push(r.userid)
                    });
                    setTimeout(() => {
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
                        giveawayCheck(entrys, winners, yikes)
                        setTimeout(async () => {
                            winners.forEach(async w => {
                                if(winners.length > yikes) {
                                    console.log('bruh')
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
                                .setColor(data.themecolor || '#FFFFFF')
                                .setTitle(`Giveaway Ended!`)
                                .setThumbnail(chantosend.guild.iconURL({ dynamic: true }) || client.user.avatarURL({ dynamic: true }))
                                .setDescription(`**Information**\nPrize: ${bruh.prize}\nWinners: ${bruh.winners}\nTime Limit: ${bruh.timelimit}\n\n**Winners**\n${bruhmoment.join("\n")}`)
                                .setFooter({ text: `Giveaway by: ${creator.tag}` })
                                await chantosend.send({ embeds: [final] }).then(() => {
                                    entrys = [];
                                    winners = [];
                                    bruhmoment = [];
                                }).catch(e => {
                                    console.log(`\nGIVEAWAY ENDING ERROR: `, e.stack)
                                });
                                await con.query(`UPDATE giveaways SET active='false' WHERE uniqueid='${bruh.uniqueid}'`, async (err, row) => {
                                    if(err) throw err;
                                });
                            }, 4000)

                        }, 6000)
                    }, 5000)
                }
            });
        }
    });
};

async function giveawayCheck(entrys, winners, yikes) {
    if(winners.length !== yikes) {
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
    }
};

async function maths(array) {
    let bruh = array[Math.floor(array.length * Math.random())];
    return bruh;
};

async function random(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

exports.userFetch = userFetch;
exports.memberFetch = memberFetch;
exports.error = error;
exports.colorize = colorize;
exports.sendError = sendError;
exports.maths = maths;
exports.guildAdd = guildAdd;
exports.guildCreate = guildAdd;
exports.guildRemove = guildRemove;
exports.guildDelete = guildRemove;
exports.giveawayCheck = giveawayCheck;
exports.giveawayPick = giveawayPick;
exports.sendLog = sendLog;
exports.random = random;
exports.makeid = random;
exports.makeCase = makeCase;