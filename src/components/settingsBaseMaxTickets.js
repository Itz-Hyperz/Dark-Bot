module.exports = async function(client, con, interaction, data, language) {
    await interaction.reply({ content: language.components.settingsBaseMaxTickets.provide, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    const filter = (m) => m.author.id == interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
    let input;
    collector.on('collect', async (m) => {
        if(m.content.toLowerCase() == language.cancel) {
            await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            collector.stop();
            return interaction.reply({ content: language.components.settingsBaseMaxTickets.cancel, ephemeral: true }).catch(e => {
                interaction.editReply({ content: language.components.settingsBaseMaxTickets.cancel, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            });
        };
        let n = Number(m.content);
        if(isNaN(n)) return interaction.editReply({ content: language.components.settingsBaseMaxTickets.valid, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        await con.query(`UPDATE guilds SET maxtickets=${n} WHERE guildid="${interaction.guild.id}"`, async (err, row) => {
            if(err) throw err;
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            interaction.editReply({ content: `**🎫 ${language.components.settingsBaseMaxTickets.updated}**`, ephemeral: true })
            collector.stop();
            return;
        });
    });
};