module.exports = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM birthdays WHERE guildid="${interaction.guild.id}" AND userid="${interaction.user.id}"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.components.birthdayRemove.noBday, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        await con.query(`DELETE FROM birthdays WHERE guildid="${interaction.guild.id}" AND userid="${interaction.user.id}"`, async (err, row) => {
            if(err) throw err;
            await interaction.reply({ content: language.components.birthdayRemove.removed, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            return;
        });
    });
};