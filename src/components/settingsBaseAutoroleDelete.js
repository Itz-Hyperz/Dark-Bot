module.exports = async function(client, con, interaction, data, language) {
    let select = Number(interaction.message.embeds[0].footer.text);
    await con.query(`SELECT * FROM autoroles WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.components.settingsBaseAutoroleDelete.no, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let bruh = row[select];
        await con.query(`DELETE FROM autoroles WHERE guildid='${interaction.guild.id}' AND roleid='${bruh.roleid}' AND verify=${bruh.verify} LIMIT 1`, async (err, row) => {
            if(err) throw err;
        });
        interaction.reply({ content: `${language.components.settingsBaseAutoroleDelete.removed}\n<@&${bruh.roleid}>`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};