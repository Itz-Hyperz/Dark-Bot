module.exports = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="clients" OR guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.noPermissions, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let granted = 0;
        await row.forEach(async (r) => {
            if(interaction.member.roles.cache.has(r.roleid)) {
                granted = 1;
            }
        });
        if(granted == 0) return interaction.reply({ content: language.missingPermissions, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        await interaction.reply({ content: "Please type what you wish to reply below.", ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        const filter = (m) => m.author.id == interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
        collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: language.components.reviewReply.cancel, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: language.components.reviewReply.cancel, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
            let input = m.content;
            let reviewButtons = new client.discord.MessageActionRow()
            .addComponents(
                new client.discord.MessageButton()
                .setStyle('PRIMARY')
                .setLabel(`${interaction.message.components[0].components[0].label}`)
                .setCustomId('reviewRating')
            )
            let reviewEmbed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setAuthor(interaction.message.embeds[0].author)
            .setTitle(interaction.message.embeds[0].title)
            .setDescription(interaction.message.embeds[0].description)
            .setFooter(interaction.message.embeds[0].footer)
            .addField(`${language.components.reviewReply.field}`, input, false);
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            await interaction.editReply({ content:language.components.reviewReply.added }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            interaction.message.edit({ embeds: [reviewEmbed], components: [reviewButtons] }).catch(e => {
                console.log(e)
            });
            collector.stop();
            return;
        });
    });
};