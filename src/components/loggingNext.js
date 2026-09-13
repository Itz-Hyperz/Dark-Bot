module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text) + 1;
    await con.query(`SELECT * FROM channels WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) curr = 0;
        let selection = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(`${language.components.loggingNext.title}`)
        .setDescription(`${language.components.loggingNext.type} \`${row[curr]?.channeltype || language.components.loggingNext.nochans}\`\n${language.components.loggingNext.chan} <#${row[curr]?.channelid || 'N/A'}>`)
        .setTimestamp()
        .setFooter({ text: `${curr}` })
        await interaction.update({ embeds: [selection] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};