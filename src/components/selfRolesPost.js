module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text);
    let refined = [];
    let channel;
    await con.query(`SELECT * FROM selfrolemenus WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) return interaction.reply({ content: language.components.selfRolesPost.unable, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let x = row[curr];
        await con.query(`SELECT * FROM selfroles WHERE panelid='${row[curr].uniqueid}'`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) return interaction.reply({ content: language.components.selfRolesPost.unable2, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            row.forEach(async (r) => {
                let obj = {
                    label: r.rolename,
                    value: r.roleid
                };
                refined.push(obj)
            });
            let embed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setTitle(x.menuname)
            .setDescription(`${language.components.selfRolesPost.desc}`)
            let base = new client.discord.MessageActionRow()
            .addComponents(
                new client.discord.MessageSelectMenu()
                .setCustomId('selfRolesSelect')
                .setPlaceholder(`${language.components.selfRolesPost.place}`)
                .addOptions(refined)
            );
            await interaction.reply({ content: language.components.selfRolesPost.provide, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            const filter = (m) => m.author.id == interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
            collector.on('collect', async (m) => {
                if(m.content.toLowerCase() == language.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: language.components.selfRolesPost.cancel, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: language.components.selfRolesPost.cancel, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
                if(m.mentions.channels.first()) {
                    channel = client.channels.cache.get(m.mentions.channels.first().id);
                } else if(!isNaN(m.content)) {
                    channel = client.channels.cache.get(m.content);
                } else {
                    await interaction.reply({ content: language.components.selfRolesPost.valid, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    return;
                }
                await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                await channel?.send({ embeds: [embed], components: [base] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                await interaction.editReply({ content: language.components.selfRolesPost.posted, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return;
            });
        });
    });
};