module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text) - 1;
    await con.query(`SELECT * FROM autorespond WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) curr = 0;
        let selection = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(language.components.settingsFunAutorespondBack.title)
        .setDescription(`${language.components.settingsFunAutorespondBack.detect}\n\`\`\`\n${row[curr]?.detect || language.components.settingsFunAutorespondBack.no}\n\`\`\`\n${language.components.settingsFunAutorespondBack.response}\n\`\`\`\n${row[curr]?.response || language.components.settingsFunAutorespondBack.none}\n\`\`\``)
        .setTimestamp()
        .setFooter({ text: `${curr}` })
        await interaction.update({ embeds: [selection] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};