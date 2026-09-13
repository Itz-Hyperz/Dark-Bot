module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text) + 1;
    await con.query(`SELECT * FROM ticketcategories WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) curr = 0;
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(`${language.components.ticketNext.a}`)
        .setDescription(`${language.components.ticketNext.b} ${row[curr]?.catname || `${language.components.ticketNext.c}`}\n${language.components.ticketNext.d} ${row[curr]?.catdesc || `${language.components.ticketNext.e}`}`)
        .setTimestamp()
        .setFooter({ text: `${curr}` })
        await interaction.update({ embeds: [embed] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};