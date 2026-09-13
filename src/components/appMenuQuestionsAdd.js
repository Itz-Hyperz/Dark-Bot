module.exports = async function(client, con, interaction, data, language) {
    let appid = interaction.message.embeds[0].author.name;
    await con.query(`SELECT * FROM applications WHERE guildid="${interaction.guild.id}" AND uniqueid="${appid}"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.components.appMenuQuestionsAdd.invalid, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        await interaction.reply({ content: language.components.appMenuQuestionsAdd.input, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        const filter = (m) => m.author.id == interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 10000000 });
        collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.cancel.toLowerCase()) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: language.components.appMenuQuestionsAdd.cancel, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: language.components.appMenuQuestionsAdd.cancel, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
            let input = m.content;
            input = input.replaceAll('"', '');
            input = input.replaceAll("`", "");
            await con.query(`INSERT INTO applicationquestions (appid, question) VALUES ("${appid}", "${input}")`, async (err, row) => {
                if(err) {
                    await interaction.editReply({ content: language.components.appMenuQuestionsAdd.error, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    return;
                }
                await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                await interaction.editReply({ content: `**${language.components.appMenuQuestionsAdd.added}**` }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return;
            });
        });
    });
};