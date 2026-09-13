module.exports = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM ticketcategories WHERE guildid="${interaction.guild.id}"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: `${language.components.ticketPanelPost.a}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let refined = [];
        row.forEach(async (c) => {
            let obj = {
                label: `🎫 ${c.catname}`,
                description: c.catdesc,
                value: c.uniqueid
            };
            refined.push(obj);
        });
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(`${language.components.ticketPanelPost.b}`)
        .setDescription(`${language.components.ticketPanelPost.c}`)
        .setTimestamp()
        .setFooter({ text: `${language.components.ticketPanelPost.d}` })
        let menu = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageSelectMenu()
                .setCustomId('ticketSelect')
                .setPlaceholder(`${language.components.ticketPanelPost.e}`)
                .addOptions(refined),
        );
        await interaction.reply({ content: `${language.components.ticketPanelPost.i}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        const filter = (m) => m.author.id == interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
        let channel;
        collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: `${language.components.ticketPanelPost.f}`, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: `${language.components.ticketPanelPost.f}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
            if(m.mentions.channels.first()) {
                channel = await client.channels.cache.get(m.mentions.channels.first().id);
            } else if(!isNaN(m.content)) {
                channel = await client.channels.cache.get(m.content);
            } else {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                interaction.editReply({ content: `${language.components.ticketPanelPost.g}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                return;
            };
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            await channel.send({ embeds: [embed], components: [menu] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            await interaction.editReply({ content: `${language.components.ticketPanelPost.h}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            collector.stop();
            return;
        });
    });
};