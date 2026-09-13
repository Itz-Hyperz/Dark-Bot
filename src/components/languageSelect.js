module.exports = async function(client, con, interaction, data, language) {
    let selection = interaction.values[0];
    await con.query(`UPDATE guilds SET language="${selection}" WHERE guildid="${interaction.guild.id}"`, async (err, row) => {
        if(err) throw err;
    });
    await interaction.reply({ content: "✅", ephemeral: true }).catch(e => {});
};