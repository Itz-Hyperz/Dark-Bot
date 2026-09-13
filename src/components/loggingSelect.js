module.exports = async function(client, con, interaction, data, language) {
    let selection = interaction.values[0];
    if(selection == undefined) return;
    await interaction.reply({ content: language.components.loggingSelectB.provide, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    const filter = (m) => m.author.id == interaction.user.id;
    let channel;
    const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
    collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: language.components.loggingSelectB.cancel, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: language.components.loggingSelectB.cancel, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
        if(m.mentions.channels.first()) {
            channel = m.mentions.channels.first().id;
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        } else if(!isNaN(m.content)) {
            channel = await client.channels.cache.get(m.content);
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            if(channel == undefined) return interaction.editReply({ content: language.components.loggingSelectB.invalid }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            channel = channel?.id;
        } else {
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            await interaction.editReply({ content: language.components.loggingSelectB.invalid }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            return;
        };
        await con.query(`INSERT INTO channels (guildid, channelid, channeltype) VALUES ("${interaction.guild.id}", "${channel}", "${selection}")`, async (err, row) => {
            if(err) throw err;
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            interaction.editReply({ content: `${language.components.loggingSelectB.created} ${selection}\n${language.components.loggingSelectB.channel} <#${channel}>`, ephemeral: true })
            collector.stop();
            return;
        });
    });
};