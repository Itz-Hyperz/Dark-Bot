module.exports = async function(client, con, interaction, data, language) {
    await con.query(`UPDATE economyusers SET robCooldown='false' WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
    });
    await interaction.reply({ content: language.components.settingsFunEconomyRob.a, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};