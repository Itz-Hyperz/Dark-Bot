module.exports = async function(client, con, interaction, data, language) {
    let select = Number(interaction.message.embeds[0].footer.text);
    await con.query(`SELECT * FROM autorespond WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.components.settingsFunAutorespondDelete.no, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let bruh = row[select];
        await con.query(`DELETE FROM autorespond WHERE guildid='${interaction.guild.id}' AND response="${bruh.response}" AND detect="${bruh.detect}" LIMIT 1`, async (err, row) => {
            if(err) throw err;
        });
        interaction.reply({ content: `${language.components.settingsFunAutorespondDelete.deleted}\n\`\`\`\n${bruh.detect}\n\`\`\``, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};