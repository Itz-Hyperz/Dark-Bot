module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text);
    await con.query(`SELECT * FROM channels WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) return interaction.deferUpdate();
        await con.query(`DELETE FROM channels WHERE guildid='${interaction.guild.id}' AND channeltype='${row[curr]?.channeltype}' AND channelid='${row[curr]?.channelid}' LIMIT 1`, async (err, row) => {
            if(err) throw err;
        });
        await interaction.reply({ content: `${language.components.loggingDelete.content}\n<#${row[curr]?.channelid}> - ${row[curr]?.channeltype}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};