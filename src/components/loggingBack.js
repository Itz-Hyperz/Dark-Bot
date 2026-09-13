module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text) - 1;
    await con.query(`SELECT * FROM channels WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) curr = 0;
        let selection = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(`${language.components.loggingBack.title}`)
        .setDescription(`${language.components.loggingBack.type} \`${row[curr]?.channeltype || language.components.loggingBack.nochans}\`\n${language.components.loggingBack.chan} <#${row[curr]?.channelid || 'N/A'}>`)
        .setTimestamp()
        .setFooter({ text: `${curr}` })
        await interaction.update({ embeds: [selection] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};