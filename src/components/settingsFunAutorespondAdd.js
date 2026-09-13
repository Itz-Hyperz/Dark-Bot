module.exports = async function(client, con, interaction, data, language) {
    await interaction.reply({ content: language.components.settingsFunAutorespondAdd.please, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    const filter = (m) => m.author.id == interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
    let c = 0;
    let input1;
    let input2;
    collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: language.components.settingsFunAutorespondAdd.cancelled, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: language.components.settingsFunAutorespondAdd.cancelled, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
        c++;
        if(c == 1) {
            input1 = m.content.toLowerCase();
            input1 = input1.replaceAll('"', '');
            input1 = input1.replaceAll("`", "");
            interaction.editReply({ content: language.components.settingsFunAutorespondAdd.provide });
            m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        } else if(c == 2) {
            input2 = m.content.toLowerCase();
            input2 = input2.replaceAll('"', '');
            input2 = input2.replaceAll("`", "");
            await con.query(`INSERT INTO autorespond (guildid, detect, response) VALUES ("${interaction.guild.id}", "${input1}", "${input2}")`, async (err, row) => {
                if(err) throw err;
                await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                interaction.editReply({ content: `${language.components.settingsFunAutorespondAdd.added}\n\`\`\`\n${input1}\n\n${input2}\n\`\`\``, ephemeral: true })
                collector.stop();
                return;
            });
        }
    });
};