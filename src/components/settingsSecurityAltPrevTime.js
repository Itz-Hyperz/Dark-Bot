module.exports = async function(client, con, interaction, data, language) {
    await interaction.reply({ content: language.components.settingsSecurityAltPrevTime.a, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    const filter = (m) => m.author.id == interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
    collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: language.components.settingsSecurityAltPrevTime.b, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: language.components.settingsSecurityAltPrevTime.b, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
        let input = m.content.toLowerCase();
        input = input.replaceAll('"', '');
        input = input.replaceAll("`", "");
        await con.query(`UPDATE guilds SET altprevtime="${input}" WHERE guildid="${interaction.guild.id}"`, async (err, row) => {
            if(err) throw err;
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            interaction.editReply({ content: language.components.settingsSecurityAltPrevTime.c, ephemeral: true })
            collector.stop();
            return;
        });
    });
};