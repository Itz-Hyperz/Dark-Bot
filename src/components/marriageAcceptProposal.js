module.exports = async function(client, con, interaction, data, menu, language) {
    await con.query(`SELECT * FROM marriage WHERE guildid='${interaction.guild.id}' AND confirmed=true AND userid='${interaction.user.id}'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            interaction.reply({ content: language.components.marriageAcceptProposal.already, ephemeral: true });
            return;
        } else {
            await con.query(`SELECT * FROM marriage WHERE guildid='${interaction.guild.id}' AND confirmed=true AND spouse='${interaction.user.id}'`, async (err, row) => {
                if(err) throw err;
                if(row[0]) {
                    interaction.reply({ content: language.components.marriageAcceptProposal.already, ephemeral: true });
                    return;
                } else {
                    let refined = new client.discord.MessageEmbed()
                    .setColor(data.themecolor || '#FFFFFF')
                    .setDescription(language.components.marriageAcceptProposal.desc1)
                    interaction.reply({ embeds: [refined], ephemeral: true })
                    const filter = (m) => m.author.id == interaction.user.id;
                    const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
                    collector.on('collect', async (m) => {
                        if(m.content.toLowerCase() == language.cancel) {
                            await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                            collector.stop();
                            return interaction.reply({ content: language.components.marriageAcceptProposal.cancel, ephemeral: true }).catch(e => {
                                interaction.editReply({ content: language.components.marriageAcceptProposal.cancel, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                            });
                        };
                        if(m.mentions.users.first() != undefined) {
                            let spouseid = m.mentions.users.first().id;
                            if(spouseid == interaction.user.id) {
                                interaction.editReply({ content: language.components.marriageAcceptProposal.self, embeds: [], ephemeral: true });
                                collector.stop();
                                await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                                return;
                            }
                            await con.query(`SELECT * FROM marriage WHERE guildid='${interaction.guild.id}' AND userid='${spouseid}' AND confirmed=false`, async (err, row) => {
                                if(err) throw err;
                                if(!row[0]) {
                                    interaction.reply({ content: language.components.marriageAcceptProposal.never, ephemeral: true }).catch(e => {
                                        interaction.editReply({ content: language.components.marriageAcceptProposal.never, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                                    });
                                    return;
                                } else {
                                    let spouse = await client.users.fetch(spouseid);
                                    let loveletter = new client.discord.MessageEmbed()
                                    .setColor(data.themecolor || '#FFFFFF')
                                    .setTitle(`${language.components.marriageAcceptProposal.title}`)
                                    .setDescription(`${language.components.marriageAcceptProposal.desc} ${interaction.user.tag}!`)
                                    .setTimestamp()
                                    await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                                    await spouse.send({ embeds: [loveletter] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                                    await con.query(`UPDATE marriage SET confirmed=true, spouse='${interaction.user.id}' WHERE guildid='${interaction.guild.id}' AND userid='${spouseid}'`, async (err, row) => {
                                        if(err) throw err;
                                        interaction.editReply({ content: `${language.components.marriageAcceptProposal.married} ${spouse.tag}`, embeds: [], ephemeral: true });
                                    });
                                    collector.stop();
                                };
                            });
                        };
                    });
                };
            });
        };
    });
};