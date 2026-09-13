module.exports = async function(client, con, interaction, data, language) {
    let select = Number(interaction.message.embeds[0].footer.text);
    await con.query(`SELECT * FROM shop WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.components.settingsFunEconomyDelete.a, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let bruh = row[select];
        await con.query(`DELETE FROM shop WHERE guildid='${interaction.guild.id}' AND productId='${bruh.productId}' LIMIT 1`, async (err, row) => {
            if(err) throw err;
        });
        interaction.reply({ content: `${language.components.settingsFunEconomyDelete.d}\n\`\`\`\n${bruh.productName}\n\`\`\``, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let logembed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setAuthor({ name: `${interaction.user.tag} - ${language.components.settingsFunEconomyDelete.title}`, iconURL: client.user.displayAvatarURL() })
        .addFields(
            { name: language.components.settingsFunEconomyDelete.i, value: `${bruh.productName}`, inline: true },
        )
        .setTimestamp()
        await client.utils.sendLog(client, con, data, 'economylogs', logembed);
    });
};