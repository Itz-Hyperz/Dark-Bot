module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text) - 1;
    await con.query(`SELECT * FROM ticketcategories WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) curr = 0;
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(`${language.components.ticketBack.a}`)
        .setDescription(`${language.components.ticketBack.b} ${row[curr]?.catname || `${language.components.ticketBack.c}`}\n${language.components.ticketBack.d} ${row[curr]?.catdesc || `${language.components.ticketBack.e}`}`)
        .setTimestamp()
        .setFooter({ text: `${curr}` })
        await interaction.update({ embeds: [embed] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};