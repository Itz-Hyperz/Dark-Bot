const { readdirSync } = require('fs');
const { join } = require('path');
const chalk = require('chalk');
const ms = require('ms');
module.exports = async(client, con, ready) => {
    // Module Handlers
    setTimeout(function() {
        require('../components/musicSystem.js')(client, con, client.defaultLanguage);
        require('../components/giveawayRefresh.js')(client, con, client.defaultLanguage);
        require('../components/birthdaySystem.js')(client, con, client.defaultLanguage);
        require('../components/marriageSystem.js')(client, con, client.defaultLanguage);
        require('../components/invalidColorHex.js')(client, con, client.defaultLanguage);
    }, 3000);
    // Presence Settings
    let presence = client.config.presence
    try {
        await client.user.setPresence({
            activities: [{
                name: presence.name,
                type: presence.type
            }],
            status: presence.status
        });
    } catch(e) {}
    setInterval(async () => {
        await con?.ping();
    }, ms('24m'));
    // Check DB for Guilds
    await client.guilds.cache.forEach(async function(guild) {
        await client.utils.guildAdd(client, con, guild.id);
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
    });
    // Economy resets
    await con.query(`UPDATE economyusers SET workCooldown='false', crimeCooldown='false', robCooldown='false'`, async (err, row) => {
        if(err) throw err;
    });
    // Reset guilds theme colors if invalid
    await con.query(`SELECT * FROM guilds`, async (err, row) => {
        if(err) throw err;
        await row.forEach(async (guild) => {
            if(!guild.themecolor.includes('#') || guild.themecolor.length != 7) {
                await con.query(`UPDATE guilds SET themecolor="#041014" WHERE guildid="${guild.guildid}"`, async (err, row) => {
                    if(err) throw err;
                });
            };
        });
    });
    // Load Slash Commands
    const commands = readdirSync(join(__dirname, `../`, `commands/slash`));
    for (let command of commands) {
        let cmd = require(`../commands/slash/${command}`);
        if (cmd.info.name) {
            client.application?.commands.create(cmd.info).catch(e => {
                console.log(e)
            })
        } else {
            console.log(`No help name or additional info found for slash command: ${command}`);
        }
    };
    console.log(`${chalk.green('[Invite Link]')} ${chalk.white(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)}`)
};