module.exports = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM birthdays WHERE guildid="${interaction.guild.id}" AND userid="${interaction.user.id}"`, async (err, row) => {
        if(err) throw err;
        if(row[0]) return interaction.reply({ content: language.components.birthdayAdd.already, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        await interaction.reply({ content: language.components.birthdayAdd.date, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        const filter = (m) => m.author.id == interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
        collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: language.components.birthdayAdd.cancel, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: language.components.birthdayAdd.cancel, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
            let input = m.content;
            input = input.replaceAll('"', '');
            input = input.replaceAll("`", "");
            await con.query(`INSERT INTO birthdays (guildid, userid, deDate) VALUES ("${interaction.guild.id}", "${interaction.user.id}", "${input}")`, async (err, row) => {
                if(err) throw err;
                await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                await interaction.editReply({ content: language.components.birthdayAdd.added }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return;
            });
        });
    });
};