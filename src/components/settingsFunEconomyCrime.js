module.exports = async function(client, con, interaction, data, language) {
    await con.query(`UPDATE economyusers SET crimeCooldown='false' WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
    });
    await interaction.reply({ content: language.components.settingsFunEconomyCrime.a, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};