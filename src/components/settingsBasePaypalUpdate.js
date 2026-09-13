module.exports = async function(client, con, interaction, data, language) {
    await interaction.reply({ content: language.components.settingsBasePaypalUpdate.new, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    const filter = (m) => m.author.id == interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
    let input;
    collector.on('collect', async (m) => {
        if(m.content.toLowerCase() == language.cancel) {
            await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            collector.stop();
            return interaction.reply({ content: language.components.settingsBasePaypalUpdate.cancelled, ephemeral: true }).catch(e => {
                interaction.editReply({ content: language.components.settingsBasePaypalUpdate.cancelled, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            });
        };
        if(m.content.toLowerCase() == language.false) {
            input = 'NA';
        } else {
            input = m.content;
            input = input.replaceAll('"', '');
            input = input.replaceAll("`", "");
        };
        await con.query(`UPDATE guilds SET paypal="${input}" WHERE guildid="${interaction.guild.id}"`, async (err, row) => {
            if(err) throw err;
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            interaction.editReply({ content: language.components.settingsBasePaypalUpdate.set, ephemeral: true })
            collector.stop();
            return;
        });
    });
};