module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text);
    let uniqueid = interaction.message.embeds[0].author.name;
    await con.query(`SELECT * FROM selfroles WHERE guildid='${interaction.guild.id}' AND panelid='${uniqueid}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) return interaction.reply({ content: language.components.selfRolesManagerDelete.no, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        await con.query(`DELETE FROM selfroles WHERE guildid='${interaction.guild.id}' AND panelid='${row[curr].uniqueid}' AND roleid='${row[curr].roleid}' LIMIT 1`, async (err, row) => {
            if(err) throw err;
        });
        await interaction.reply({ content: language.components.selfRolesManagerDelete.deleted, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};