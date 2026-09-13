module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text) + 1;
    await con.query(`SELECT * FROM applications WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) curr = 0;
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(language.components.appMenuGoHome.title)
        .setDescription(`**${language.components.appMenuGoHome.name}** ${row[curr]?.appname || language.components.appMenuGoHome.noapps}`)
        .setTimestamp()
        .setFooter({ text: `${curr}` })
        await interaction.update({ embeds: [embed] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};