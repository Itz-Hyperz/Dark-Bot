module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text) - 1;
    await con.query(`SELECT * FROM autoroles WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) curr = 0;
        let check;
        if(row[curr]?.verify) {
            check = 'true';
        } else if(!row[curr]?.verify) {
            check = 'false';
        } else {
            check = language.components.settingsBaseAutoroleBack.no;
        };
        let selection = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(`${language.components.settingsBaseAutoroleBack.title}`)
        .setDescription(`${language.components.settingsBaseAutoroleBack.role}\n<@&${row[curr]?.roleid || language.components.settingsBaseAutoroleBack.no}>\n\n${language.components.settingsBaseAutoroleBack.verification}\n${check}`)
        .setTimestamp()
        .setFooter({ text: `${curr}` })
        await interaction.update({ embeds: [selection] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};