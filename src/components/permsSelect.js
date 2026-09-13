module.exports = async function(client, con, interaction, data, language) {
    let selection = interaction.values[0];
    if(selection == undefined) return;
    await interaction.reply({ content: language.components.permsSelect.provide, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    const filter = (m) => m.author.id == interaction.user.id;
    let role;
    const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
    collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.components.permsSelect.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: language.components.permsSelect.Cancelled, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: language.components.permsSelect.Cancelled, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
        if(m.mentions.roles.first()) {
            role = m.mentions.roles.first().id;
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        } else if(!isNaN(m.content)) {
            role = m.content;
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        } else {
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            await interaction.editReply({ content: `${language.components.permsSelect.invalid}` }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            return;
        };
        await con.query(`INSERT INTO perms (guildid, roleid, permtype) VALUES ("${interaction.guild.id}", "${role}", "${selection}")`, async (err, row) => {
            if(err) throw err;
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            interaction.editReply({ content: `${language.components.permsSelect.created}`, ephemeral: true })
            collector.stop();
            return;
        });
    });
};