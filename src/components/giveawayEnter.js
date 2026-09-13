module.exports = async function(client, con, interaction, guilddata, language) {
    let message = interaction.message
    await con.query(`SELECT * FROM giveaways WHERE messageid='${message.id}' AND active='true'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            let uid = row[0].uniqueid
            await con.query(`SELECT COUNT(*) as total FROM giveawayentrys WHERE gid='${uid}'`, async (err, row) => {
                if(err) throw err;
                let amount = row[0].total
                await con.query(`SELECT * FROM giveawayentrys WHERE userid='${interaction.user.id}' AND gid='${uid}'`, async (err, row) => {
                    if(err) throw err;
                    if(!row[0]) {
                        await con.query(`INSERT INTO giveawayentrys (userid, gid) VALUES ('${interaction.user.id}', '${uid}')`, async (err, row) => {
                            if(err) throw err;
                            interaction.reply({ content: `<@${interaction.user.id}> ${language.components.giveawayEnter.enter} **${amount + 1}** ${language.components.giveawayEnter.entries}`, ephemeral: true }).then(msg => {
                            }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                        });
                    } else {
                        interaction.reply({ content: `${language.components.giveawayEnter.already} **${amount}** ${language.components.giveawayEnter.entries}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    }
                });
            });
        } else {
            interaction.reply({ content: language.components.giveawayEnter.notActive, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        };
    });

};