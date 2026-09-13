module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text);
    await con.query(`SELECT * FROM applications WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) return interaction.deferUpdate();
        await con.query(`DELETE FROM applications WHERE guildid='${interaction.guild.id}' AND uniqueid='${row[curr]?.uniqueid}' AND closed=${row[curr]?.closed} LIMIT 1`, async (err, row) => {
            if(err) throw err;
        });
        await con.query(`DELETE FROM applicationquestions WHERE appid='${row[curr]?.uniqueid}'`, async (err, row) => {
            if(err) throw err;
        });
        await interaction.reply({ content: `**${language.components.appMenuDelete.deleted}**\n${row[curr]?.appname}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};