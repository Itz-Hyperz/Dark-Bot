module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text);
    await con.query(`SELECT * FROM selfrolemenus WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) return interaction.reply({ content: language.components.selfRolesDelete.unable, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        await con.query(`DELETE FROM selfrolemenus WHERE guildid='${interaction.guild.id}' AND uniqueid='${row[curr].uniqueid}'`, async (err, row) => {
            if(err) throw err;
        });
        await con.query(`DELETE FROM selfroles WHERE guildid='${interaction.guild.id}' AND panelid='${row[curr].uniqueid}'`, async (err, row) => {
            if(err) throw err;
        });
        await interaction.reply({ content: language.components.selfRolesDelete.deleted, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};