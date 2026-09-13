module.exports = async function(client, con, interaction, data, language) {
    await interaction.reply({ content: language.components.settingsFunAutoreactAdd.please, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    const filter = (m) => m.author.id == interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
    let c = 0;
    let input1;
    let input2;
    collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: language.components.settingsFunAutoreactAdd.cancelled, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: language.components.settingsFunAutoreactAdd.cancelled, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
        c++;
        if(c == 1) {
            if(m.mentions.channels.first()) {
                input1 = m.mentions.channels.first().id;
                interaction.editReply({ content: language.components.settingsFunAutoreactAdd.provide });
            } else if(!isNaN(m.content)) {
                input1 = m.content;
                interaction.editReply({ content: language.components.settingsFunAutoreactAdd.provide });
            } else {
                c = 0;
                interaction.editReply({ content: language.components.settingsFunAutoreactAdd.valid })
            }
            m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        } else if(c == 2) {
            input2 = m.content.toLowerCase();
            input2 = input2.replaceAll('"', '');
            input2 = input2.replaceAll("`", "");
            await con.query(`INSERT INTO autoreact (guildid, channelid, emoji) VALUES ("${interaction.guild.id}", "${input1}", "${input2}")`, async (err, row) => {
                if(err) throw err;
                await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                interaction.editReply({ content: `${language.components.settingsFunAutoreactAdd.added}\n\`\`\`\n${input1}\n\n${input2}\n\`\`\``, ephemeral: true })
                collector.stop();
                return;
            });
        }
    });
};