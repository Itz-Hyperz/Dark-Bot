module.exports = async function(client, con, interaction, data, language) {
    let select = Number(interaction.message.embeds[0].footer.text);
    await con.query(`SELECT * FROM ticketcategories WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: `${language.components.ticketDelete.a}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let bruh = row[select];
        await con.query(`DELETE FROM ticketcategories WHERE guildid='${interaction.guild.id}' AND uniqueid='${bruh.uniqueid}' LIMIT 1`, async (err, row) => {
            if(err) throw err;
        });
        interaction.reply({ content: `${language.components.ticketDelete.b}\n${bruh.catname}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};