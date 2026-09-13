module.exports = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM pingprev WHERE guildid="${interaction.guild.id}" AND userid="${interaction.user.id}"`, async (err, row) => {
        if(err) throw err;
        if(row[0]) return interaction.reply({ content: language.components.pingPreventionAdd.already, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        await interaction.reply({ content: language.components.pingPreventionAdd.color, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        const filter = (m) => m.author.id == interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
        let input1;
        let input2;
        let c = 0;
        collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: language.components.pingPreventionAdd.cancel, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: language.components.pingPreventionAdd.cancel, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
            c++;
            if(c == 1) {
                input1 = m.content;
                input1 = input1.replaceAll('"', '');
                input1 = input1.replaceAll("`", "");
                await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                await interaction.editReply({ content: language.components.pingPreventionAdd.provide })
            } else if(c == 2) {
                input2 = m.content;
                if(input2.toLowerCase() == 'skip') {
                    input2 = 'NA';
                };
                input2 = input2.replaceAll('"', '');
                input2 = input2.replaceAll("`", "");
                await con.query(`INSERT INTO pingprev (guildid, userid, themecolor, imagelink) VALUES ("${interaction.guild.id}", "${interaction.user.id}", "${input1}", "${input2}")`, async (err, row) => {
                    if(err) throw err;
                    await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    await interaction.editReply({ content: language.components.pingPreventionAdd.added }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    collector.stop();
                    return;
                });
            };
        });
    });
};