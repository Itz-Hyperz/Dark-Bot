module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text) + 1;
    await con.query(`SELECT * FROM autoreact WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) curr = 0;
        let selection = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(language.components.settingsFunAutoreactNext.title)
        .setDescription(`${language.components.settingsFunAutoreactNext.channel}\n<#${row[curr]?.channelid || language.components.settingsFunAutoreactNext.no}>\n\n${language.components.settingsFunAutoreactNext.response}\n${row[curr]?.emoji || language.components.settingsFunAutoreactNext.emoji}`)
        .setTimestamp()
        .setFooter({ text: `${curr}` })
        await interaction.update({ embeds: [selection] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};