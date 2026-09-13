exports.run = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM economyusers WHERE guildid='${interaction.guild.id}' AND userid='${interaction.user.id}'`, async (err, row) => {
        if(err) throw err;
        if(row[0].workCooldown == 'true') return interaction.reply({ content: language.economy.work.cooldown, ephemeral: true }).catch(e => {});
        let responses = language.economy.work.workResponses
        let answer = await client.utils.maths(responses)
        await con.query(`UPDATE economyusers SET balance = balance + ${answer.amount}, workCooldown='true' WHERE userid='${interaction.user.id}' AND guildid='${interaction.guild.id}'`, async (err, row) => {
            if(err) throw err;
        });
        interaction.reply({ content: `${answer.text}${data.currency}${answer.amount}`, ephemeral: client.config.commands.ephemeral }).catch(e => {});
        setTimeout(async () => {
            await con.query(`UPDATE economyusers SET workCooldown='false' WHERE userid='${interaction.user.id}' AND guildid='${interaction.guild.id}'`, async (err, row) => {
                if(err) throw err;
            });
        }, 7200000)
    });
};

exports.info = {
    "name": "work",
    "description": "Go to work."
}