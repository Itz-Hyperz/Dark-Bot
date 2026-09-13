exports.run = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM afkusers WHERE userid='${interaction.user.id}' AND guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            await con.query(`DELETE FROM afkusers WHERE userid='${interaction.user.id}' AND guildid='${interaction.guild.id}'`, async (err, row) => {
                if(err) throw err;
                await interaction.reply({ content: language.afkNoLonger, ephemeral: client.config.commands.ephemeral }).catch(e => {});
            });
        } else {
            await con.query(`INSERT INTO afkusers (userid, guildid) VALUES ('${interaction.user.id}', '${interaction.guild.id}')`, async (err, row) => {
                if(err) throw err;
                interaction.reply({ content: language.nowMarkedAFK, ephemeral: client.config.commands.ephemeral })
            });
        };
    });
}

exports.info = {
    "name": "afk",
    "description": "Toggle your AFK status."
}