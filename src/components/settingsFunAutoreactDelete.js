module.exports = async function(client, con, interaction, data, language) {
    let select = Number(interaction.message.embeds[0].footer.text);
    await con.query(`SELECT * FROM autoreact WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.components.settingsFunAutoreactDelete.no, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let bruh = row[select];
        await con.query(`DELETE FROM autoreact WHERE guildid='${interaction.guild.id}' AND channelid="${bruh.channelid}" AND emoji="${bruh.emoji}" LIMIT 1`, async (err, row) => {
            if(err) throw err;
        });
        interaction.reply({ content: `${language.components.settingsFunAutoreactDelete.deleted}\n\`\`\`\n${bruh.channelid} - ${bruh.emoji}\n\`\`\``, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};