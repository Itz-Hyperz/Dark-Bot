module.exports = async function(client, con, interaction, data, language) {
    let select = Number(interaction.message.embeds[0].footer.text);
    await con.query(`SELECT * FROM filtered WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.components.settingsSecurityFilterDelete.a, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let bruh = row[select];
        if(!bruh) return interaction.reply({ content: language.components.settingsSecurityFilterDelete.b, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        await con.query(`DELETE FROM filtered WHERE guildid='${interaction.guild.id}' AND content='${bruh.content}' LIMIT 1`, async (err, row) => {
            if(err) throw err;
        });
        interaction.reply({ content: `${language.components.settingsSecurityFilterDelete.c}\n\`\`\`\n${bruh.content}\n\`\`\``, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};