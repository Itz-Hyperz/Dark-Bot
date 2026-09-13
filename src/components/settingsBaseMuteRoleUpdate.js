module.exports = async function(client, con, interaction, data, language) {
    await interaction.reply({ content: language.components.settingsBaseMuteRoleUpdate.mention, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    const filter = (m) => m.author.id == interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
    let muterole;
    collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: language.components.settingsBaseMuteRoleUpdate.cancelled, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: language.components.settingsBaseMuteRoleUpdate.cancelled, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
        if(m.mentions.roles.first()) {
            muterole = m.mentions.roles.first().id;
        } else if(!isNaN(m.content)) {
            muterole = m.content;
            muterole = muterole.replaceAll('"', '');
            muterole = muterole.replaceAll('`', '');
        } else {
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            await interaction.editReply({ content: language.components.settingsBaseMuteRoleUpdate.valid })
            return;
        };
        await con.query(`UPDATE guilds SET muterole="${muterole}" WHERE guildid="${interaction.guild.id}"`, async (err, row) => {
            if(err) throw err;
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            interaction.editReply({ content: language.components.settingsBaseMuteRoleUpdate.updated, ephemeral: true })
            collector.stop();
            return;
        });
    });
};