module.exports = async function(client, con, interaction, guilddata, language) {
    
    let message = interaction.message
    await con.query(`SELECT * FROM giveaways WHERE messageid='${message.id}' AND active='true'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            if(interaction.user.id === row[0].starter) {
                client.utils.giveawayPick(client, con, row[0].uniqueid, guilddata)
                interaction.reply({ content: language.components.giveawayEnd.end, ephemeral: true }).catch(e => {})
            } else {
                interaction.reply({ content: `${language.components.giveawayEnd.notCreator} <@${row[0].starter}>`, ephemeral: true }).catch(e => {})
            };
        } else {
            await con.query(`SELECT * FROM giveaways WHERE messageid='${message.id}' AND active='false'`, async (err, row) => {
                if(err) throw err;
                if(row[0]) {
                    if(interaction.user.id === row[0].starter) {
                        interaction.reply({ content: language.components.giveawayEnd.ended, ephemeral: true }).catch(e => {})
                    } else {
                        interaction.reply({ content: `${language.components.giveawayEnd.notCreator1} <@${row[0].starter}>`, ephemeral: true }).catch(e => {})
                    }
                } else {
                    interaction.reply({ content: language.components.giveawayEnd.noExist, ephemeral: true }).catch(e => {})
                };
            });
        }
    });

};