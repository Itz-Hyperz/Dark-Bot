module.exports = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM stickymsgs WHERE guildid="${interaction.guild.id}"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: `${language.components.stickyRemove.a}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        await interaction.reply({ content: `${language.components.stickyRemove.b}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        const filter = (m) => m.author.id == interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
        let channel;
        collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: `${language.components.stickyRemove.c}`, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: `${language.components.stickyRemove.c}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
            if(m.mentions.channels.first()) {
                channel = m.mentions.channels.first().id;
                channel = channel.replaceAll('"', '');
                channel = channel.replaceAll("`", "");
            } else if(!isNaN(m.content)) {
                channel = m.content;
                channel = channel.replaceAll('"', '');
                channel = channel.replaceAll("`", "");
            } else {
                interaction.editReply({ content: `${language.components.stickyRemove.d}` }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                return;
            };
            await con.query(`SELECT * FROM stickymsgs WHERE guildid='${interaction.guild.id}' AND channel='${channel}'`, async (err, row) => {
                if(err) throw err;
                if(row[0]) {
                    await con.query(`DELETE FROM stickymsgs WHERE guildid="${interaction.guild.id}" AND channel="${channel}"`, async (err, row) => {
                        if(err) throw err;
                        await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                        await interaction.editReply({ content: `${language.components.stickyRemove.e}` }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                        collector.stop();
                        return;
                    });
                } else {
                    await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    await interaction.editReply({ content: `${language.components.stickyRemove.f}` }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    return;
                }
            });
        });
    });
};