module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text) + 1;
    await con.query(`SELECT * FROM shop WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) curr = 0;
        let lol = row[curr]
        let embed = new client.discord.MessageEmbed()
        .setColor(data.colorhex)
        .setTitle(language.components.settingsFunEconomy.economy)
        .setDescription(`${language.components.settingsFunEconomy.currency2} ${data.currency}\n\n${language.components.settingsFunEconomy.shop}\n${language.components.settingsFunEconomy.id} ${lol?.productId || language.components.settingsFunEconomy.no}\n${language.components.settingsFunEconomy.name} ${lol?.productName || language.components.settingsFunEconomy.no}\n${language.components.settingsFunEconomy.price} ${lol?.productPrice || language.components.settingsFunEconomy.no}`)
        .setTimestamp()
        .setFooter({ text: `${curr}` })
        await interaction.update({ embeds: [embed] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};