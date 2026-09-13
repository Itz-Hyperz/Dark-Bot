module.exports = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM clients WHERE guildid="${interaction.guild.id}"`, async (err, row) => {
        if(err) throw err;
        if (!row[0]) return interaction.reply({ content: language.components.clientRemove.noClients, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        await interaction.reply({ content: language.components.clientRemove.mention, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        const filter = (m) => m.author.id == interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
        let input;
        collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: language.components.birthdayAdd.cancel, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: language.components.birthdayAdd.cancel, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
            if(m.mentions.users.first()) {
                input = m.mentions.users.first().id;
            } else if(!isNaN(m.content)) {
                let user = await client.users.fetch(m.content);
                if(user == undefined) return interaction.editReply({ content: language.components.clientRemove.iClient, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                input = user.id;
            } else {
                return interaction.editReply({ content: language.components.clientRemove.iClient, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            }
            input = input.replaceAll('"', '');
            input = input.replaceAll("`", "");
            await con.query(`SELECT * FROM clients WHERE guildid="${interaction.guild.id}" AND userid="${input}"`, async (err, row) => {
                if(err) throw err;
                if(!row[0]) return interaction.editReply({ content:language.components.clientRemove.notR, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                await con.query(`DELETE FROM clients WHERE guildid='${interaction.guild.id}' AND userid='${input}'`, async (err, row) => {
                    if(err) throw err;
                    await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    let user = await client.users.fetch(input);
                    let found = interaction.guild.members.cache.get(input);
                    if(found != undefined) {
                        await con.query(`SELECT * FROM perms WHERE guildid='${interaction.guild.id}' AND permtype='customers'`, async (err, row) => {
                            if(err) throw err;
                            await row.forEach(async (r) => {
                                await found.roles.remove(r.roleid).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                            });
                        });
                    };
                    let logembed = new client.discord.MessageEmbed()
                    .setColor(data.themecolor || '#FFFFFF')
                    .setTitle(language.components.clientRemove.removed)
                    .setDescription(`**${user.tag}** ${language.components.clientRemove.dsec}`)
                    .setTimestamp()
                    client.utils.sendLog(client, con, data, 'clientlogs', logembed);
                    await interaction.editReply({ content: language.components.clientRemove.done }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    collector.stop();
                    return;
                });
            });
        });
    });
};