exports.run = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM economyusers WHERE guildid='${interaction.guild.id}' AND userid='${interaction.user.id}'`, async (err, row) => {
        if(err) throw err;
        if(row[0].crimeCooldown == 'true') return interaction.reply({ content: language.economy.crime.cooldown, ephemeral: true }).catch(e => {});
        let responses = language.economy.crime.crimeResponses
        let answer = await client.utils.maths(responses)
        await con.query(`UPDATE economyusers SET balance = balance + ${answer.amount}, crimeCooldown='true' WHERE userid='${interaction.user.id}' AND guildid='${interaction.guild.id}'`, async (err, row) => {
            if(err) throw err;
        });
        interaction.reply({ content: `${answer.text}${data.currency}${answer.amount}`, ephemeral: client.config.commands.ephemeral }).catch(e => {});
        setTimeout(async () => {
            await con.query(`UPDATE economyusers SET crimeCooldown='false' WHERE userid='${interaction.user.id}' AND guildid='${interaction.guild.id}'`, async (err, row) => {
                if(err) throw err;
            });
        }, 7200000)
    });
};

exports.info = {
    "name": "crime",
    "description": "Commit a crime."
}