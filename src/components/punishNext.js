module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text) + 1;
    let user = await client.users.fetch(interaction.message.embeds[0].author.name.split('(')[1].replaceAll(')', ''))
    await con.query(`SELECT * FROM cases WHERE guildid='${interaction.guild.id}' AND userid='${user.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) curr = 0;
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setAuthor(interaction.message.embeds[0].author)
        .setTitle(`Case Information`)
        .setTitle(`${language.components.punishNext.title}`)
        .addFields(
            { name: `${language.components.punishNext.field1}`, value: `${row[curr].caseid}`, inline: false },
            { name: `${language.components.punishNext.field2}`, value: `\`${row[curr].casetype}\``, inline: false },
            { name: `${language.components.punishNext.field3}`, value: `<@${row[curr].enforcerid}> (${row[0].enforcerid})`, inline: false },
            { name: `${language.components.punishNext.field4}`, value: `<@${row[curr].userid}> (${row[0].userid})`, inline: false },
            { name: `${language.components.punishNext.field5}`, value: `${row[curr].reason}`, inline: false },
            { name: `${language.components.punishNext.field6}`, value: `${row[curr].timedate}`, inline: false },
        )
        .setTimestamp()
        .setFooter({ text: `${curr}` })
        await interaction.update({ embeds: [embed] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};