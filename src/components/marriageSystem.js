const chalk = require('chalk');
module.exports = async function(client, con, language) {
    await con.query(`SELECT * FROM marriage WHERE confirmed=0`, async (err, row) => {
        if(!row || !row[0]) return;
        console.log(`${chalk.red("[" + language.components.marriageSystem.con1 + "]")} ${row.length}${language.components.marriageSystem.con2}`);
        await con.query(`DELETE FROM marriage WHERE confirmed=0`, async (err, row) => {
            if(err) throw err;
        });
    });
};