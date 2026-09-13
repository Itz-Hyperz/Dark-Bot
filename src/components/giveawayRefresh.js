const ms = require('ms');
const chalk = require('chalk');
module.exports = async function(client, con, language) {
    // Ensure giveaways are continued after restart
    await con.query(`SELECT * FROM giveaways WHERE active='true'`, async (err, rows) => {
        if(err) throw err;
        if(rows[0]) {
            rows.forEach(async r => {
                console.log(chalk.yellow(`${language.components.giveawayRefresh.for} ${r.prize} ${language.components.giveawayRefresh.with} ${r.winners} ${language.components.giveawayRefresh.finish}`))
                setTimeout(async () => {
                    await con.query(`SELECT * FROM giveaways WHERE active='true' AND uniqueid='${r.uniqueid}' AND messageid='${r.messageid}'`, async (err, row) => {
                        if(err) throw err;
                        if(row[0]) {
                            let channel = await client.channels.cache.get(row[0].channelid)
                            await con.query(`SELECT * FROM guilds WHERE guildid="${channel?.guild?.id}"`, async (err, row) => {
                                if(err) throw err;
                                if(!row[0]) await client.utils.guildAdd(client, con, channel?.guild?.id);
                                client.utils.giveawayPick(client, con, r.uniqueid, row[0])
                            });
                        }
                    });
                }, ms(r.timelimit))
            });
        }
    });
};

