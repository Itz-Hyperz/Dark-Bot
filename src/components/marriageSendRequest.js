module.exports = async function(client, con, interaction, data, menu, language) {
    await con.query(`SELECT * FROM marriage WHERE guildid='${interaction.guild.id}' AND userid='${interaction.user.id}' AND confirmed=true`, async (err, rowo) => {
        if(err) throw err;
        await con.query(`SELECT * FROM marriage WHERE guildid='${interaction.guild.id}' AND spouse='${interaction.user.id}' AND confirmed=true`, async (err, row) => {
            if(err) throw err;
            if(row[0] || rowo[0]) {
                await interaction.reply({ content: language.components.marriageSendRequest.already, ephemeral: true });
            } else {
                let refined = new client.discord.MessageEmbed()
                .setColor(data.themecolor || '#FFFFFF')
                .setDescription(`${language.components.marriageSendRequest.desc}`)
                interaction.reply({ embeds: [refined], ephemeral: true })
                const filter = (m) => m.author.id == interaction.user.id;
                const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
                collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: language.components.marriageSendRequest.cancel, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: language.components.marriageSendRequest.cancel, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
                    if(m.mentions.users.first() != undefined) {
                        let spouseid = m.mentions.users.first().id;
                        if(spouseid == interaction.user.id) {
                            interaction.editReply({ content: language.components.marriageSendRequest.self, embeds: [], ephemeral: true });
                            collector.stop();
                            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                            return;
                        }
                        let spouse = await client.users.fetch(spouseid);
                        if(spouse.bot) {
                            await interaction.editReply({ content: language.components.marriageSendRequest.bot, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                            await collector.stop()
                            return;
                        };
                        let loveletter = new client.discord.MessageEmbed()
                        .setColor(data.themecolor || '#FFFFFF')
                        .setTitle(`${language.components.marriageSendRequest.title}`)
                        .setDescription(`${interaction.user.tag} ${language.components.marriageSendRequest.desc1} <#${interaction.channel.id}>${language.components.marriageSendRequest.desc12}`)
                        .setTimestamp()
                        await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                        await con.query(`SELECT * FROM marriage WHERE guildid='${interaction.guild.id}' AND userid='${spouseid}' AND confirmed=true`, async (err, rowol) => {
                            if(err) throw err;
                            await con.query(`SELECT * FROM marriage WHERE guildid='${interaction.guild.id}' AND spouse='${spouseid}' AND confirmed=true`, async (err, rowl) => {
                                if(err) throw err;
                                if(rowl[0] || rowol[0]) {
                                    interaction.editReply({ content: language.components.marriageSendRequest.person, embeds: [], ephemeral: true });
                                    return;
                                };
                                await con.query(`INSERT INTO marriage (guildid, userid, spouse, confirmed) VALUES ('${interaction.guild.id}', '${interaction.user.id}', '${spouseid}', false)`, async (err, row) => {
                                    if(err) throw err;
                                    await spouse.send({ embeds: [loveletter] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                                    let lol = new client.discord.MessageEmbed()
                                    .setColor(data.themecolor || '#FFFFFF')
                                    .setDescription(`${language.components.marriageSendRequest.sent}`)
                                    .setTimestamp()
                                    interaction.editReply({ embeds: [lol], ephemeral: true });
                                    setTimeout(async function() {
                                        await con.query(`SELECT * FROM marriage WHERE guildid='${interaction.guild.id}' AND userid='${interaction.user.id}' AND spouse='${spouseid}' AND confirmed=false`, async (err, row) => {
                                            if(err) throw err;
                                            if(row[0]) {
                                                let expired = new client.discord.MessageEmbed()
                                                .setColor(data.themecolor || '#FFFFFF')
                                                .setDescription(`${language.components.marriageSendRequest.expired} <@${spouseid}> ${language.components.marriageSendRequest.expired2}`)
                                                .setTimestamp()
                                                await interaction.user.send({ embeds: [expired] });
                                                await con.query(`DELETE FROM marriage WHERE guildid='${interaction.guild.id}' AND userid='${interaction.user.id}' AND spouse='${spouseid}' AND confirmed=false`, async (err, row) => {
                                                    if(err) throw err;
                                                });
                                            };
                                        });
                                    }, 120000);
                                });
                            });
                        });
                        collector.stop();
                    };
                });
            };
        });
    });
};