module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text) + 1;
    await con.query(`SELECT * FROM selfrolemenus WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) curr = 0;
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(`${language.components.selfRolesNext.title}`)
        .setDescription(`${language.components.selfRolesNext.desc} \`${row[curr]?.menuname || language.components.selfRolesNext.noMenus}\``)
        .setTimestamp()
        .setFooter({ text: `${curr}` })
        await interaction.update({ embeds: [embed] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};