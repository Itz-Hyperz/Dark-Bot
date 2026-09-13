const chalk = require('chalk');
module.exports = async function(con) {

    // SQL Structure
    let data = [
        {
            tablename: "guilds",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)",
                },
                {
                    name: "themecolor",
                    type: "TEXT"
                },
                {
                    name: "language",
                    type: "TEXT",
                },
                {
                    name: "welcometype",
                    type: "varchar(255)"
                },
                {
                    name: "leavetype",
                    type: "varchar(255)"
                },
                {
                    name: "altprevtime",
                    type: "TEXT"
                },
                {
                    name: "currency",
                    type: "TEXT"
                },
                {
                    name: "toslink",
                    type: "TEXT"
                },
                {
                    name: "paypal",
                    type: "TEXT"
                },
                {
                    name: "cashapp",
                    type: "TEXT"
                },
                {
                    name: "custompay",
                    type: "TEXT"
                },
                {
                    name: "maxtickets",
                    type: "INT"
                },
                {
                    name: "muterole",
                    type: "varchar(255)"
                },
                {
                    name: "welcomecardurl",
                    type: "TEXT"
                },
                {
                    name: "verification",
                    type: "BOOLEAN"
                },
                {
                    name: "captcha",
                    type: "BOOLEAN"
                },
                {
                    name: "autorole",
                    type: "BOOLEAN"
                },
                {
                    name: "altprev",
                    type: "BOOLEAN"
                },
                {
                    name: "lockdown",
                    type: "BOOLEAN"
                },
                {
                    name: "leveling",
                    type: "BOOLEAN"
                },
                {
                    name: "levelkick",
                    type: "BOOLEAN"
                },
                {
                    name: "birthdays",
                    type: "BOOLEAN"
                },
                {
                    name: "privatecallcreate",
                    type: "varchar(255)"
                },
                {
                    name: "privatecallcategory",
                    type: "varchar(255)"
                }
            ]
        },
        {
            tablename: "economyusers",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "userid",
                    type: "varchar(255)"
                },
                {
                    name: "balance",
                    type: "INT"
                },
                {
                    name: "bank",
                    type: "INT"
                },
                {
                    name: "workCooldown",
                    type: "varchar(255)"
                },
                {
                    name: "crimeCooldown",
                    type: "varchar(255)"
                },
                {
                    name: "robCooldown",
                    type: "varchar(255)"
                }
            ]
        },
        {
            tablename: "clients",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "userid",
                    type: "varchar(255)"
                },
                {
                    name: "uniqueid",
                    type: "INT"
                }
            ]
        },
        {
            tablename: "cases",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "caseid",
                    type: "INT"
                },
                {
                    name: "userid",
                    type: "varchar(255)"
                },
                {
                    name: "enforcerid",
                    type: "varchar(255)"
                },
                {
                    name: "casetype",
                    type: "varchar(255)"
                },
                {
                    name: "reason",
                    type: "varchar(255)"
                },
                {
                    name: "timedate",
                    type: "TEXT"
                }
            ]
        },
        {
            tablename: "selfrolemenus",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "uniqueid",
                    type: "TEXT"
                },
                {
                    name: "menuname",
                    type: "TEXT"
                }
            ]
        },
        {
            tablename: "selfroles",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "panelid",
                    type: "TEXT"
                },
                {
                    name: "roleid",
                    type: "TEXT"
                },
                {
                    name: "rolename",
                    type: "TEXT"
                }
            ]
        },
        {
            tablename: "stickymsgs",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "channel",
                    type: "varchar(255)"
                },
                {
                    name: "response",
                    type: "TEXT"
                }
            ]
        },
        {
            tablename: "ticketcategories",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "uniqueid",
                    type: "TEXT"
                },
                {
                    name: "catid",
                    type: "varchar(255)"
                },
                {
                    name: "catname",
                    type: "TEXT"
                },
                {
                    name: "catdesc",
                    type: "TEXT"
                }
            ]
        },
        {
            tablename: "tickets",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "userid",
                    type: "varchar(255)"
                },
                {
                    name: "claimedby",
                    type: "varchar(255)"
                },
                {
                    name: "channelid",
                    type: "varchar(255)"
                },
                {
                    name: "catuniqueid",
                    type: "TEXT"
                }
            ]
        },
        {
            tablename: "offlinebans",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "userid",
                    type: "varchar(255)"
                },
                {
                    name: "reason",
                    type: "TEXT"
                },
                {
                    name: "enforcerid",
                    type: "varchar(255)"
                }
            ]
        },
        {
            tablename: "chatlvl",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "userid",
                    type: "varchar(255)"
                },
                {
                    name: "userxp",
                    type: "INT"
                },
                {
                    name: "userlvl",
                    type: "INT"
                }
            ]
        },
        {
            tablename: "marriage",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "userid",
                    type: "varchar(255)"
                },
                {
                    name: "spouse",
                    type: "varchar(255)"
                },
                {
                    name: "confirmed",
                    type: "boolean"
                }
            ]
        },
        {
            tablename: "birthdays",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "userid",
                    type: "TEXT"
                },
                {
                    name: "deDate",
                    type: "TEXT"
                }
            ]
        },
        {
            tablename: "shop",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "productId",
                    type: "varchar(255)"
                },
                {
                    name: "productName",
                    type: "TEXT"
                },
                {
                    name: "productPrice",
                    type: "INT"
                }
            ]
        },
        {
            tablename: "owneditems",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "productId",
                    type: "INT"
                },
                {
                    name: "productName",
                    type: "TEXT"
                },
                {
                    name: "userid",
                    type: "varchar(255)"
                }
            ]
        },
        {
            tablename: "autoroles",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "roleid",
                    type: "varchar(255)"
                },
                {
                    name: "verify",
                    type: "boolean"
                }
            ]
        },
        {
            tablename: "pingprev",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "userid",
                    type: "varchar(255)"
                },
                {
                    name: "themecolor",
                    type: "TEXT"
                },
                {
                    name: "imagelink",
                    type: "TEXT"
                }
            ]
        },
        {
            tablename: "autoreact",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "channelid",
                    type: "varchar(255)"
                },
                {
                    name: "emoji",
                    type: "TEXT"
                }
            ]
        },
        {
            tablename: "autorespond",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "detect",
                    type: "TEXT"
                },
                {
                    name: "response",
                    type: "TEXT"
                }
            ]
        },
        {
            tablename: "filtered",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "content",
                    type: "TEXT"
                }
            ]
        },
        {
            tablename: "afkusers",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "userid",
                    type: "varchar(255)"
                }
            ]
        },
        {
            tablename: "giveaways",
            columns: [
                {
                    name: "prize",
                    type: "TEXT"
                },
                {
                    name: "winners",
                    type: "TEXT"
                },
                {
                    name: "timelimit",
                    type: "TEXT"
                },
                {
                    name: "uniqueid",
                    type: "INT"
                },
                {
                    name: "messageid",
                    type: "varchar(255)"
                },
                {
                    name: "channelid",
                    type: "varchar(255)"
                },
                {
                    name: "active",
                    type: "varchar(255)"
                },
                {
                    name: "starter",
                    type: "varchar(255)"
                }
            ]
        },
        {
            tablename: "giveawayentrys",
            columns: [
                {
                    name: "gid",
                    type: "varchar(255)"
                },
                {
                    name: "userid",
                    type: "varchar(255)"
                }
            ]
        },
        {
            tablename: "applications",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "closed",
                    type: "boolean"
                },
                {
                    name: "uniqueid",
                    type: "TEXT"
                },
                {
                    name: "appname",
                    type: "TEXT"
                },
                {
                    name: "acceptMessage",
                    type: "TEXT"
                },
                {
                    name: "denyMessage",
                    type: "TEXT"
                }
            ]
        },
        {
            tablename: "applicationquestions",
            columns: [
                {
                    name: "appid",
                    type: "TEXT"
                },
                {
                    name: "question",
                    type: "TEXT"
                }
            ]
        },
        {
            tablename: "channels",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "channelid",
                    type: "varchar(255)"
                },
                {
                    name: "channeltype",
                    type: "TEXT"
                }
            ]
        },
        {
            tablename: "perms",
            columns: [
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "roleid",
                    type: "varchar(255)"
                },
                {
                    name: "permtype",
                    type: "TEXT"
                }
            ]
        },
        {
            tablename: "privatecalls",
            columns: [
                {
                    name: "uniqueid",
                    type: "TEXT"
                },
                {
                    name: "guildid",
                    type: "varchar(255)"
                },
                {
                    name: "ownerid",
                    type: "varchar(255)"
                },
                {
                    name: "alloweduserids",
                    type: "TEXT"
                }
            ]
        }
    ];

    // Looping and checking if the tables are complete
    await data.forEach(async function(d) {
        let query = `CREATE TABLE ${d.tablename} (`;
        await d.columns.forEach(async function(pass) {
            if(query.endsWith('(')) {
                query = query + ` ${pass.name} ${pass.type}`;
            } else {
                query = query + `, ${pass.name} ${pass.type}`;
            };
        });
        await con.query(`SELECT * FROM ${d.tablename}`, async function(err, row) {
            if(err) {
                console.log(`${chalk.yellowBright('[SQL Manager]')} ${d.tablename} table not found, creating...`);
                await con.query(`${query} );`, async function(err, row) {
                    if(err) throw err;
                });
            } else {
                await con.query(`SHOW COLUMNS FROM ${d.tablename}`, async function(err, row2) {
                    if(err) throw err;
                    let tbl = [];
                    await row2.forEach(async function(arow) {
                        await tbl.push(arow.Field.toLowerCase());
                    });
                    await d.columns.forEach(async function(pass) {
                        if(!tbl.includes(pass.name.toLowerCase())) {
                            console.log(`${chalk.yellowBright('[SQL Manager]')} ${pass.name} column not found in ${d.tablename} table, creating...`);
                            await con.query(`ALTER TABLE ${d.tablename} ADD ${pass.name} ${pass.type}`, async function(err, row) {
                                if(err) throw err;
                            });
                        };
                    });
                });
            };
        });
    });

    setTimeout(() => {
        con.query(`UPDATE guilds SET privatecallcreate="none", privatecallcategory="none" WHERE privatecallcreate IS NULL`, function(err, row) {
            if(err) throw err;
        });
    }, 5000);

};