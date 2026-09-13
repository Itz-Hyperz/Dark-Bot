module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text) - 1;
    await con.query(`SELECT * FROM perms WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) curr = 0;
        let selection = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(`${language.components.permsBack.title}`)
        .setDescription(`${language.components.permsBack.type} \`${row[curr]?.permtype || language.components.permsBack.no}\`\n${language.components.permsBack.role} <@&${row[curr]?.roleid || 'N/A'}>`)
        .setTimestamp()
        .setFooter({ text: `${curr}` })
        await interaction.update({ embeds: [selection] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};