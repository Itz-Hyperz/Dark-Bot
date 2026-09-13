module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text);
    await con.query(`SELECT * FROM perms WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) return interaction.deferUpdate();
        await con.query(`DELETE FROM perms WHERE guildid='${interaction.guild.id}' AND permtype='${row[curr]?.permtype}' AND roleid='${row[curr]?.roleid}' LIMIT 1`, async (err, row) => {
            if(err) throw err;
        });
        await interaction.reply({ content: `${language.components.permsDelete.content}\n<@&${row[curr]?.roleid}> - ${row[curr]?.permtype}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};