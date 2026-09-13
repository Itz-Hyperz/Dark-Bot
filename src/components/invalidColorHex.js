module.exports = async function(client, con) {
    await con.query(`SELECT * FROM guilds WHERE themecolor NOT LIKE '#%'`, async function(err, row) {
        if(err) throw err;
        if(!row[0]) return;
        await row.forEach(async (r) => {
            await con.query(`UPDATE guilds SET themecolor='#FFFFFF' WHERE guildid='${r.guildid}' LIMIT 1`, async function(err, row) {
                if(err) throw err;
            });
        });
    });
};