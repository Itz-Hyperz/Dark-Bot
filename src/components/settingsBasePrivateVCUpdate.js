module.exports = async function(client, con, interaction, data, language) {
    await interaction.reply({ content: language.components.settingsBasePrivateVCUpdate.please, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    const filter = (m) => m.author.id == interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
    collector.on('collect', async (m) => {
        if(m.content.toLowerCase() == language.cancel) {
            await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            collector.stop();
            return interaction.reply({ content: language.components.settingsBasePrivateVCUpdate.cancelled, ephemeral: true }).catch(e => {
                interaction.editReply({ content: language.components.settingsBasePrivateVCUpdate.cancelled, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            });
        };
        let input;
        if(m.mentions.channels.first()) {
            input = m.mentions.channels.first().id;
        } else if(!isNaN(m.content)) {
            input = m.content;
        } else {
            collector.stop();
            return interaction.reply({ content: language.components.settingsBasePrivateVCUpdate.valid, ephemeral: true }).catch(e => {
                interaction.editReply({ content: language.components.settingsBasePrivateVCUpdate.valid, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            });
        };
        input = input.replaceAll('"', '');
        input = input.replaceAll("`", "");
        await con.query(`UPDATE guilds SET privatecallcreate="${input}" WHERE guildid="${interaction.guild.id}"`, async (err, row) => {
            if(err) throw err;
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            interaction.editReply({ content: language.components.settingsBasePrivateVCUpdate.updated, ephemeral: true })
            collector.stop();
            return;
        });
    });
};