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
            if(!row[0]) return interaction.reply({ content: `${language.components.ticketrename.a}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            await interaction.reply({ content: `${language.components.ticketrename.b}`, ephemeral: false }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            const filter = (m) => m.author.id == interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
            let input;
            collector.on('collect', async (m) => {
                if(m.content.toLowerCase() == language.cancel) {
                    await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    collector.stop();
                    return interaction.reply({ content: `${language.components.ticketrename.c}`, ephemeral: true }).catch(e => {
                        interaction.editReply({ content: `${language.components.ticketrename.c}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    });
                };
                input = m.content;
                await interaction.channel.setName(input);
                await m.delete().catch(e => {})
                await interaction.editReply({ content: `${language.components.ticketrename.d}` }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return;
            });
        });
    });
};