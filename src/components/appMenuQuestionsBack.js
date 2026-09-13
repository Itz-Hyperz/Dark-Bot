module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text) - 1;
    let appid = interaction.message.embeds[0].author.name;
    await con.query(`SELECT * FROM applications WHERE guildid='${interaction.guild.id}' AND uniqueid='${appid}'`, async (err, row) => {
        if(err) throw err;
        let appName = row[0]?.appname
        await con.query(`SELECT * FROM applicationquestions WHERE appid='${appid}'`, async (err, row) => {
            if(err) throw err;
            if(!row[curr]) curr = 0;
            let embed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setTitle(language.components.appMenuQuestions.title)
            .setAuthor({ name: appid, iconURL: client.user.avatarURL({ dynamic: true }) })
            .setDescription(`**${language.components.appMenuQuestions.app}** ${appName}\n**${language.components.appMenuQuestions.question}**\n\`\`\`\n${row[curr]?.question || language.components.appMenuQuestions.noQuestion}\n\`\`\``)
            .setTimestamp()
            .setFooter({ text: `${curr}` })
            await interaction.update({ embeds: [embed] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        });
    });
};