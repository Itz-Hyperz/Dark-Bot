module.exports = async function(client, con, modal) {
    await con.query(`SELECT * FROM guilds WHERE guildid='${modal.guildId}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) await client.utils.guildAdd(client, con, modal.guildId);
        let language = require(`../utils/languages/${row[0]?.language || 'english'}.json`)
        require(`../components/${modal.customId}.js`)(client, con, modal, row[0], language);
    });
};