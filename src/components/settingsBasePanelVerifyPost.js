module.exports = async function(client, con, interaction, data, language) {
    await interaction.reply({ content: language.components.settingsBasePanelVerifyPost.provide, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    const filter = (m) => m.author.id == interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
    let channel;
    collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: language.components.settingsBasePanelVerifyPost.cancelled, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: language.components.settingsBasePanelVerifyPost.cancelled, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
        if(m.mentions.channels.first()) {
            channel = m.mentions.channels.first().id;
        } else if(!isNaN(m.content)) {
            channel = m.content
        } else {
            interaction.editReply({ content: language.components.settingsBasePanelVerifyPost.valid }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        }
        let found = await client.channels.cache.get(channel);
        if(found == undefined) {
            interaction.editReply({ content: language.components.settingsBasePanelVerifyPost.valid }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        } else {
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            let verifyButton = new client.discord.MessageActionRow()
            .addComponents(
                new client.discord.MessageButton()
                .setLabel(`🗝️ ${language.components.settingsBasePanelVerifyPost.verify}`)
                .setStyle('SECONDARY')
                .setCustomId('verifyButton')
            )
            let verifyEmbed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setTitle(`🔒 ${language.components.settingsBasePanelVerifyPost.verification}`)
            .setDescription(language.components.settingsBasePanelVerifyPost.please)
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            await found.send({ embeds: [verifyEmbed], components: [verifyButton] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            await interaction.editReply({ content: language.components.settingsBasePanelVerifyPost.posted, ephemeral: true })
            collector.stop();
            return;
        };
    });
};