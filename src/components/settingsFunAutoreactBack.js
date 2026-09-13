module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text) - 1;
    await con.query(`SELECT * FROM autoreact WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) curr = 0;
        let selection = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(language.components.settingsFunAutoreactBack.title)
        .setDescription(`${language.components.settingsFunAutoreactBack.channel}\n<#${row[curr]?.channelid || language.components.settingsFunAutoreactBack.no}>\n\n${language.components.settingsFunAutoreactBack.response}\n${row[curr]?.emoji || language.components.settingsFunAutoreactBack.emoji}`)
        .setTimestamp()
        .setFooter({ text: `${curr}` })
        await interaction.update({ embeds: [selection] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};