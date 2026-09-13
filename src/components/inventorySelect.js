module.exports = async function(client, con, interaction, data, language) {
    let selection = interaction.values[0];
    await con.query(`SELECT * FROM owneditems WHERE guildid='${interaction.guild.id}' AND userid='${interaction.user.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.components.inventorySelect.noItems, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        await con.query(`SELECT * FROM owneditems WHERE guildid='${interaction.guild.id}' AND userid='${interaction.user.id}' AND productId=${selection}`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) return interaction.reply({ content: language.components.inventorySelect.noItems, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            await interaction.reply({ content: `**${interaction.user.tag}** ${language.components.inventorySelect.used} ${row[0].productName}` }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        });
        await con.query(`DELETE FROM owneditems WHERE guildid='${interaction.guild.id}' AND userid='${interaction.user.id}' AND productId=${selection} LIMIT 1`, async (err, row) => {
            if(err) throw err;
        });
        let logembed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setAuthor({ name: `${interaction.user.tag}${language.components.inventorySelect.logAuthor}`, iconURL: client.user.displayAvatarURL() })
        .addFields(
            { name: language.components.inventorySelect.field1, value: `${row[0].productName}`, inline: true },
        )
        .setTimestamp()
        await client.utils.sendLog(client, con, data, 'economylogs', logembed);
    });
};