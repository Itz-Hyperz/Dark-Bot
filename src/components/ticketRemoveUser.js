module.exports = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="tickets" OR guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.noPermissions, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let granted = 0;
        await row.forEach(async (r) => {
            if(interaction.member.roles.cache.has(r.roleid)) {
                granted = 1;
            }
        });
        if(granted == 0) return interaction.reply({ content: language.missingPermissions, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        await con.query(`SELECT * FROM tickets WHERE channelid="${interaction.channel.id}"`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) return interaction.reply({ content: `${language.components.ticketremove.a}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            await interaction.reply({ content: `${language.components.ticketremove.b}`, ephemeral: false }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            const filter = (m) => m.author.id == interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
            let member;
            collector.on('collect', async (m) => {
                if(m.content.toLowerCase() == language.cancel) {
                    await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    collector.stop();
                    return interaction.reply({ content: `${language.components.ticketremove.c}`, ephemeral: true }).catch(e => {
                        interaction.editReply({ content: `${language.components.ticketremove.c}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    });
                };
                if(m.mentions.users.first()) {
                    member = m.mentions.users.first().id;
                } else if(!isNaN(m.content)) {
                    let lol = client.users.fetch(m.content);
                    if(lol == undefined) return interaction.editReply({ content: `${language.components.ticketremove.d}`, ephemeral: false }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    member = m.content
                } else {
                    return interaction.editReply({ content: `${language.components.ticketremove.d}`, ephemeral: false }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                }
                member = interaction.guild.members.cache.get(member);
                if(!member) return interaction.editReply({ content:  `${language.components.ticketremove.d}`, ephemeral: false }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                await interaction.channel.permissionOverwrites.edit(member, { VIEW_CHANNEL: false, SEND_MESSAGES: false });
                await m.delete().catch(e => {})
                await interaction.editReply({ content: `**${member.user.tag}** ${language.components.ticketremove.e}` }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return;
            });
        });
    });
};